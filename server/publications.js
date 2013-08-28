superChatStream = new Meteor.Stream('superChatStream');

// SuperChat stuff
Meteor.publish('usersSuperChat', function(){
    return Meteor.users.find({}, {fields: {superchat: true}});
});

Meteor.publish('superChatUserPresence', function() {
  // Setup some filter to find the users your logged in user
  // cares about. It's unlikely that you want to publish the 
  // presences of _all_ the users in the system.
  var filter = {}; 

  // ProTip: unless you need it, don't send lastSeen down as it'll make your 
  // templates constantly re-render (and use bandwidth)
  return Meteor.presences.find(filter, {fields: {state: true, userId: true}});
});

superChatStream.permissions.read(function (eventName) {
    return true;
});

superChatStream.permissions.write(function (eventName) {
    return !! this.userId;
});

superChatStream.addFilter(function (eventName, args) {
    if (! this.userId) {
        return [];
    }

    args.push('says');
    return args;
});

Meteor.users.before('insert', function (userId, doc) {
    if (!doc.superchat)
        doc.superchat = {};
    doc = saveUserProfile(doc);
});
