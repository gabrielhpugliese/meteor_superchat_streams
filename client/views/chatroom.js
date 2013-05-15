
Template.chatroom.rendered = function () {
    // TODO: Ask meteor-talk about this unbind strange behaviour
    $('#msg').unbind('keydown');
    $('#msg').keydown(function (event) {
        if ((event.keyCode || event.which || event.charCode || 0) != 13)
            return;

        sendMsg();
    });
    $('#chat').niceScroll({
        autohidemode: false,
        cursoropacitymin: 0.3,
        cursoropacitymax: 0.3
    });
}

Template.chatroom.msgs = function() {
    if (!Meteor.router)
        return;

    return Msgs.find({host : Meteor.router.invocation().host});
};

Template.chatroom.getProfile = function(user_id) {
    try {
        return Meteor.users.findOne(user_id)['profile'];
    } catch (err) {}
};

Template.chatroom.scrollToBottom = function() {
    // TODO: Figure how to do it properly
    Meteor.defer(function() {
        try {
            var chat = document.getElementById('chat');
            chat.scrollTop = chat.scrollHeight;
        } catch(err) {}
    });
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

