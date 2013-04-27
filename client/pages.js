Meteor.pages({
    '/' : {to : 'chatroom', before: setParent},
    '/:host' : {to : 'chatroom', before: setParent}
});

function setParent () {
    this.set('host', this.params.host || 'global');
}
