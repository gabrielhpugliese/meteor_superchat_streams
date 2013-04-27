Meteor.publish('userPresence', function() {
  // Setup some filter to find the users your logged in user
  // cares about. It's unlikely that you want to publish the 
  // presences of _all_ the users in the system.
  var filter = {}; 

  // ProTip: unless you need it, don't send lastSeen down as it'll make your 
  // templates constantly re-render (and use bandwidth)
  return Meteor.presences.find(filter, {fields: {state: true, userId: true, host: true}});
});

Meteor.publish('Users', function(){
    return Meteor.users.find({}, {fields: {profile: true}});
});

Meteor.publish('Msgs', function (host) {
    return Msgs.find({host: host});
});

Meteor.users.find().observe({
    changed : function(user) {
        saveProfile(user);
    },
    added : function(user) {
        saveProfile(user);
    }
});

Meteor.presences.find().observe({
    //TODO: Enter/leave messages
});

Msgs.allow({
    insert : function (userId, doc) {
        return userId && doc.owner === userId && doc.msg && doc.host && doc.action;
    }
});
