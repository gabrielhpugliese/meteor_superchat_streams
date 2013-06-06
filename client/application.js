
Meteor.subscribe('usersSuperChat');
Deps.autorun(function () {
	Meteor.setInterval(function () {
		var host = null;
		if (Meteor.router)
			host = Meteor.router.path();
			
		Meteor.subscribe('msgsSuperChat', host);
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