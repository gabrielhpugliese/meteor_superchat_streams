
Meteor.subscribe('usersSuperChat');
Meteor.subscribe('msgsSuperChat', location.pathname);

// Marked options

marked.setOptions({
	langPrefix: '',
	breaks: true,
	highlight: function(code) {
	    return hljs.highlightAuto(code).value;
	}
});