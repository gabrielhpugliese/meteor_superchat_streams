Path = DepsPath();

usersSubs = Meteor.subscribe('usersSuperChat');

if (typeof Superchat === 'undefined') {
    Superchat = {};
    Superchat.messageLimitOnScreen = 50;
    Superchat.defaultProfilePicture = 'http://i.imgur.com/HKSh9X9.png';
}

// Marked options
marked.setOptions({
    langPrefix: '',
    breaks: true,
    sanitize: true,
    highlight: function(code) {
        return hljs.highlightAuto(code).value;
    }
});
