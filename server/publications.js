Meteor.publish('usersSuperChat', function(){
    return Meteor.users.find({}, {fields: {profile: true}});
});

Meteor.publish('msgsSuperChat', function (host) {
	if (host)
    	return Msgs.find({host: host});
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

Meteor.presences.find().observe({
    //TODO: Enter/leave messages
});

Msgs.allow({
    insert : function (userId, doc) {
        return userId && doc.owner === userId && doc.msg && doc.host && doc.action;
    }
});
