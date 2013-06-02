
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
	        sendMsg();
	        return false;
		});
    });
    $('#msg').blur(function () {
    	KeyboardJS.clear('enter');
    	KeyboardJS.clear('shift + enter');
    });
    $('#chat').niceScroll({
        autohidemode: false,
        cursoropacitymin: 0.3,
        cursoropacitymax: 0.3
    });
    scrollToBottom();
}

Template.chatroom.msgs = function() {
    if (!Meteor.router)
        return;

	$('#scroll-to-bottom').show();
    return Msgs.find({host : Meteor.router.invocation().host});
};

Template.chatroom.getProfile = function(user_id) {
    try {
        return Meteor.users.findOne(user_id)['profile'];
    } catch (err) {}
};

Template.chatroom.events({
    'click .msg-send' : function () {
        sendMsg();
    }
});

sendMsg = function () {
    var $msg = $('#msg');
    Msgs.insert({
        action: 'says',
        msg: $msg.val(),
        owner: Meteor.userId(),
        host: Meteor.router.invocation().host
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
