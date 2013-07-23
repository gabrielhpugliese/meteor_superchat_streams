//Meteor.users.find().observe({
//    changed : function(user) {
//        saveProfile(user);
//    },
//    added : function(user) {
//        saveProfile(user);
//    }
//});

// SuperChat stuff
Meteor.publish('usersSuperChat', function(){
    return Meteor.users.find({}, {fields: {superchat: true}});
});

Meteor.publish('superChatMsgs', function (host) {
    if (host)
        return superChatMsgs.find({host: host});
    else
        this.stop();
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

superChatMsgs.allow({
    insert : function (userId, doc) {
        if (!(doc.host && userId && doc.owner === userId && doc.msg && doc.msg.length < 500))
            return false;
            
        var user = Meteor.users.findOne({_id: userId});
        if (typeof user.superchat.canChat !== 'undefined' && !user.superchat.canChat)
            return false;
        
        // check if is flooding and ban user
        var lastMsgs = superChatMsgs.find({owner: userId, host: doc.host}, {
                    sort: {createdAt: -1},
                    limit: 3
                }).fetch(),
            now = +(new Date());
        if (lastMsgs.length === 3 && now - lastMsgs[2].createdAt <= 1000) {
            Meteor.users.update({_id: userId}, {
                $set: {
                    'superchat.canChat': false,
                    'superchat.whenCanChat': now + (60 * 1000)
                }
            });
        }
        return true;
    }
});

superChatMsgs.before('insert', function (userId, doc) {
    doc.action = 'says';
    doc.createdAt = +(new Date());
});

Meteor.users.before('insert', function (userId, doc) {
    if (!doc.superchat)
        doc.superchat = {};
    doc = saveUserProfile(doc);
});
