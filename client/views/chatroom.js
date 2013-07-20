
Template.chatroom.rendered = function () {
    // TODO: Ask meteor-talk about this unbind strange behaviour
    $('#msg').unbind('focus');
    $('#msg').focus(function () {
    	var $self = $(this);
        KeyboardJS.on('shift + enter', function(){
        	var val = $self.val() + '\n';
        	$self.val(val);
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
        $('#chat').niceScroll({
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
        return Meteor.users.findOne(user_id)['profile'];
    } catch (err) {}
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
