Msgs = new Meteor.Collection('msgs');
Rooms = new Meteor.Collection('rooms');
Presences = new Meteor.Collection('presences');
Connections = new Meteor.Collection('connections');

Msg = {
    set : function(name, action, msg, room, host) {
        return Msgs.insert({
            user_name : name,
            user_id : Meteor.userId(),
            action : action,
            msg : msg,
            room : room,
            host: host
        });
    },
};

Room = {
    set : function(name, host) {
        return Rooms.insert({
            name : name,
            host : host
        });
    },
    get : function(name, host) {
        return Rooms.findOne({
            name : name,
            host : host
        });
    }
}

Presence = {
    set : function(room, host) {
        return Presences.insert({
            user_id : Meteor.userId(),
            room : room,
            host : host
        });
    },
    get : function(room, host) {
        return Presences.find({
            user_id : Meteor.userId(),
            room : room,
            host : host
        });
    },
    get_by_user_id : function(user_id) {
        return Presences.findOne({
            user_id : user_id,
        });
    },
    remove : function(room, host) {
        return Presences.remove({
            user_id : Meteor.userId(),
            room : room,
            host : host
        });
    }
}

Connection = {
    set : function(host) {
        if (!Meteor.user())
            return;
        return Connections.insert({
            user_id : Meteor.userId(),
            host : host,
            last_seen : +(new Date())/1000
        });
    },
    get : function(host) {
        return Connections.find({
            user_id : Meteor.userId(),
            host : host
        });
    },
    get_one : function(host) {
        return Connections.findOne({
            user_id : Meteor.userId(),
            host : host
        });
    },
    update : function(host) {
        if (!Meteor.user())
            return;
        return Connections.update({
            user_id : Meteor.userId(),
            host : host
        }, {$set : {
            last_seen : +(new Date())/1000
        }});
    }
}
