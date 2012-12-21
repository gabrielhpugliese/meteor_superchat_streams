// Collections
Msgs = new Meteor.Collection('msgs');
Rooms = new Meteor.Collection('rooms');
Profiles = new Meteor.Collection('profiles');

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
