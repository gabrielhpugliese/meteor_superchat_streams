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
    if (! this.userId) {
        return false;
    }

    var user = Meteor.users.findOne({_id: this.userId});
    if (! user.superchat) {
        user.superchat = {};
        Meteor.users.update({_id: user._id}, {$set: {superchat: {}}});
    }

    return true;
});

superChatStream.addFilter(function (eventName, args) {
    var user = Meteor.users.findOne({_id: this.userId}),
        message = args[0];

    if (! this.userId || 
        (typeof user.superchat.canChat !== 'undefined' && !user.superchat.canChat),
        message.length === 0) {
        return [];
    }

    var messagesInRow = user.superchat.messagesInRow,
        lastMessageOn = user.superchat.lastMessageOn,
        now = +(new Date());

    if (messagesInRow >= 3 && now - lastMessageOn <= 1000) {
        Meteor.users.update({_id: user._id}, {
            $set: {
                'superchat.lastMessageOn': +(new Date()), 
                'superchat.canChat': false,
                'superchat.whenCanChat': now + (60 * 1000)
            }
        });
    } else {
        Meteor.users.update({_id: user._id}, {
            $set: {'superchat.lastMessageOn': +(new Date())},
            $inc: {'superchat.messagesInRow': 1}
        });
    }

    args.push('says');
    return args;
});

Meteor.users.before('insert', function (userId, doc) {
    if (!doc.superchat)
        doc.superchat = {};
    doc = saveUserProfile(doc);
});
