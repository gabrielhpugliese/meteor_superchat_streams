
setParent = function () {
    this.set('host', Meteor.router.path() || 'global');
}

