save_pic_square = function(user){
    var user = Meteor.users.findOne(user['_id']),
        pic_square;
    
    if (user['profile']['pic_square'])
        return;
        
    if ('facebook' in user['services']){
        pic_square = 'http://graph.facebook.com/'+user['services']['facebook']['id']+'/picture?type=square';
    } else if ('google' in user['services']){
        pic_square = 'https://www.google.com/s2/photos/profile/'+user['services']['google']['id'];
    } else if ('twitter' in user['services']){
        pic_square = 'https://api.twitter.com/1/users/profile_image/'+user['services']['twitter']['id'];
    }
    user['profile']['pic_square'] = pic_square;
    
    return Meteor.users.update(user['_id'], {$set: {profile: user['profile']}});
}


if (Meteor.isServer) {
    Meteor.publish('Rooms', function (host) {
        var rooms = Rooms.find({host: host});
        if (rooms.count() != 5){
            Rooms.remove({});
            for (var i = 1; i < 6; i++){
                Room.set('Room #' + i, host);
            }
            rooms = Rooms.find({host: host});
        }
        return rooms;
    });
    
    Meteor.publish('Users', function(){
        return Meteor.users.find({});
    });
        
    Meteor.users.find().observe({
        changed : function(user) {
            save_pic_square(user);
        },
        added : function(user) {
            save_pic_square(user);
        }
    });
    
    Meteor.publish('Msgs', function (room, host) {
        return Msgs.find({room: room, host: host}); 
    });
    
    msg_set = function(action, msg, room, host) {
        var user_name = Meteor.user()['profile']['name'];
        if (!user_name)
            return;
        Msg.set(user_name, action, msg, room, host);
    }
    
    Meteor.methods({
        says : function(msg, room, host){
            msg_set(' says: ', msg, room, host);
        },
        joined : function(room, host){
            msg_set(' joined room...', '', room, host);
        },
        left : function(room, host){
            msg_set(' left room...', '', room, host);
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