if (typeof Handlebars !== 'undefined') {
    Handlebars.registerHelper('markdownAlternate', function (options) {
        var message = options.fn(this);

        message = message.replace(/^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/, '$2').replace(/^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/, '$2');
        return marked(message);
    });
}
