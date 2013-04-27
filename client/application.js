
Meteor.subscribe('Users');
Session.set('msgsLoading', true);
Meteor.autosubscribe(function () {
    var interval = Meteor.setInterval(function () {
        if (!Meteor.router)
            return;
        Meteor.subscribe('Msgs', Meteor.router.invocation().host);
        Meteor.clearInterval(interval);
        Session.set('msgsLoading', false);
    });
});
Meteor.subscribe('userPresence');

Meteor.Presence.state = function() {
    if (!Meteor.router)
        return {online: true};
    
    return {
        online: true,
        host: Meteor.router.invocation().host
    };
}