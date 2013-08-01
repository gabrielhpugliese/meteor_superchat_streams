
Template.chatroom.rendered = function () {
    // TODO: Ask meteor-talk about this unbind strange behaviour
    $('#msg').unbind('focus');
    $('#msg').focus(function () {
    	var self = this;
        KeyboardJS.on('shift + enter', function(){
            insertAtCaret(self, '\n');
        	return false;
       	});

		KeyboardJS.on('enter', function () {
		    if ($('#msg').attr('disabled') !== 'disabled')
	           sendMsg();
	        return false;
		});
    });
    
    $('#msg').blur(function () {
    	KeyboardJS.clear('enter');
    	KeyboardJS.clear('shift + enter');
    });
    
    try {
        $('#chat,#users-list').niceScroll({
            autohidemode: false,
            cursoropacitymin: 0.3,
            cursoropacitymax: 0.3
        });
    } catch (err) {
        console.error('Could not apply jQuery.niceScroll to the chatroom', err);
    }
    
    scrollToBottom();
    
    
}

Template.chatroom.msgs = function() {
    return superChatMsgs.find();
};

Template.chatroom.getProfile = function(user_id) {
    try {
        return Meteor.users.findOne(user_id).superchat;
    } catch (err) {}
};

Template.chatroom.onlineUsers = function () {
    var presences = Meteor.presences.find({userId: {$exists: true}}).fetch(),
        ids = _.pluck(presences, 'userId'),
        query = [];

    if (_.isEmpty(ids))
        return;
    
    for (var i in ids) {
        query.push({_id: ids[i]});
    }

    return Meteor.users.find({$or: query});
};

Template.chatroom.events({
    'click .msg-send' : function () {
        sendMsg();
    },
    'keyup #msg' : function (event) {
        var target = event.target,
            len = target.value.length;
        if (len > 500) {
            target.value = target.value.substring(0, 500);
        } else {
            $('#msg-counter').text(500 - len);
        }
    },
    'focus #msg' : function (event) {
        if (Meteor.user()) {
            $('#login-buttons').popover('hide');
            return;
        }
        $('#login-buttons').popover({
            animation: true,
            content: function () {
               return 'You first need to login before sending messages.';
            }
        }).popover('show');
    },
    'focusout #msg' : function (event) {
        $('#login-buttons').popover('hide');
    },
    'click #toggle-users-list' : function () {
        $('#users-list').toggle();
    }
});

sendMsg = function () {
    var $msg = $('#msg');
    
    superChatMsgs.insert({
        msg: $msg.val(),
        owner: Meteor.userId(),
        host: Path()
    });
    $msg.val('');
}

scrollToBottom = function () {
	Meteor.defer(function() {
		try {
	        var chat = document.getElementById('chat');
	        chat.scrollTop = chat.scrollHeight;
	    } catch(err) {}
    });
}

insertAtCaret = function(txtarea, text) {
    // got from here http://stackoverflow.com/questions/1064089/inserting-a-text-where-cursor-is-using-javascript-jquery
    var scrollPos = txtarea.scrollTop;
    var strPos = 0;
    var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ? "ff" : (document.selection ? "ie" : false ) );
    if (br == "ie") {
        txtarea.focus();
        var range = document.selection.createRange();
        range.moveStart('character', -txtarea.value.length);
        strPos = range.text.length;
    } else if (br == "ff")
        strPos = txtarea.selectionStart;

    var front = (txtarea.value).substring(0, strPos);
    var back = (txtarea.value).substring(strPos, txtarea.value.length);
    txtarea.value = front + text + back;
    strPos = strPos + text.length;
    if (br == "ie") {
        txtarea.focus();
        var range = document.selection.createRange();
        range.moveStart('character', -txtarea.value.length);
        range.moveStart('character', strPos);
        range.moveEnd('character', 0);
        range.select();
    } else if (br == "ff") {
        txtarea.selectionStart = strPos;
        txtarea.selectionEnd = strPos;
        txtarea.focus();
    }
    txtarea.scrollTop = scrollPos;
}

Deps.autorun(function () {
    var user = Meteor.user();
    if (user && typeof user.profile.canChat !== 'undefined' && !user.profile.canChat) {
        $('#msg').attr('disabled', 'disabled');
        $('#msg').val('You are banned for 60s for flooding.');
        $('.msg-send').attr('disabled', 'disabled');
    } else {
        $('#msg').removeAttr('disabled');
        $('#msg').val('');
        $('.msg-send').removeAttr('disabled');
    }
});
