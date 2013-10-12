if (typeof Handlebars !== 'undefined') {
    Handlebars.registerHelper('markdownAlternate', function (options) {
        var message = options.fn(this)
          , markedMessage = null;

        message = message.replace(/^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/, '$2').replace(/^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/, '$1');
         
        markedMessage = marked(message);
        markedMessage = markedMessage.replace(/<a href/g, '<a target="_blank" href');
        return markedMessage;
    });

    Handlebars.registerHelper('defaultProfilePicture', function () {
        return Superchat.defaultProfilePicture;
    });
}
