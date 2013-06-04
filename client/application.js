
Meteor.subscribe('usersSuperChat');
Session.set('msgsLoading', true);
Meteor.autosubscribe(function () {
    var interval = Meteor.setInterval(function () {
        if (!Meteor.router)
            return;
        Meteor.subscribe('msgsSuperChat', Meteor.router.invocation().host);
        Meteor.clearInterval(interval);
        Session.set('msgsLoading', false);
    }, 100);
});

// Marked options

marked.setOptions({
	langPrefix: '',
	breaks: true,
	highlight: function(code) {
	    return hljs.highlightAuto(code).value;
	}
});