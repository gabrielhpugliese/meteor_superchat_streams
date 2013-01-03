// Collections
Msgs = new Meteor.Collection('msgs');
Rooms = new Meteor.Collection('rooms');
Presences = new Meteor.Collection('people');

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
    remove : function(room, host) {
        return Presences.remove({
            user_id : Meteor.userId(),
            room : room,
            host : host
        });
    }
}
