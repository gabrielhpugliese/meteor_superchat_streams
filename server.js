
if (Meteor.isServer) {
    Meteor.publish('Rooms', function (host) {
        var rooms = Rooms.find({host: host});
        if (rooms.count() != 5){
            Rooms.remove({});
            for (var i = 1; i < 6; i++){
                Room.set('Room #' + i, host);
            }
        }
        return rooms;
    });
    
    Meteor.publish('Msgs', function (room, host) {
        return Msgs.find({room: room, host: host}); 
    });
    
    msg_method = function(action, msg, room, host) {
        var user_name = Meteor.user()['profile']['name'];
        if (!user_name)
            return;
        Msg.set(user_name, action, msg, room, host);
    }
    
    Meteor.methods({
        says : function(msg, room, host){
            msg_method(' says: ', msg, room, host);
        },
        joined : function(room, host){
            msg_method(' joined room...', '', room, host);
        },
        left : function(room, host){
            msg_method(' left room...', '', room, host);
        }
    });
    
    Msgs.deny(
        insert = function() {
            return true;
        },
        update = function(){
            return true;
        },
        remove = function(){
            return true;
        }
    );
    
    Rooms.deny(
        insert = function() {
            return true;
        },
        update = function() {
            return true;
        },
        remove = function() {
            return true;
        }
    );
}