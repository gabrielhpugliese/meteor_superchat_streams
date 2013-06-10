Meteor.publish('usersSuperChat', function(){
    return Meteor.users.find({}, {fields: {profile: true}});
});

Meteor.publish('superChatMsgs', function (host) {
	if (host)
    	return superChatMsgs.find({host: host});
    else
    	this.stop();
});

Meteor.users.find().observe({
    changed : function(user) {
        saveProfile(user);
    },
    added : function(user) {
        saveProfile(user);
    }
});

superChatMsgs.allow({
    insert : function (userId, doc) {
        return userId && doc.owner === userId && doc.msg && doc.host && doc.action;
    }
});
