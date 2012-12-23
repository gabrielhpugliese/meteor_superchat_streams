// get_facebook_data = function(user_id, path, fql) {
    // var token = Meteor.users.findOne(user_id).services.facebook.accessToken, 
        // fb_url = 'https://graph.facebook.com', 
        // response;
//         
    // if (path) {
        // response = Meteor.http.get(fb_url + path + '?access_token=' + encodeURIComponent(token));
    // } else {
        // response = Meteor.http.get(fb_url + '/fql?q=' + fql + '&access_token=' + encodeURIComponent(token));
    // }
    // return response;
// };
// 
// get_facebook_me = function(user_id) {
    // var fql = 'SELECT name, pic_square, uid FROM user WHERE uid = me()',
        // me = Profile.get(user_id);
//     
    // if (!me){
        // var result = get_facebook_data(user_id, undefined, fql);
        // if ( !result.error && result['data'] ) {
            // // if successfully obtained facebook profile, save it off
            // Profile.set(user_id, result['data']['data'][0]);
        // }
    // }
    // return me;
// };


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
    
    Meteor.publish('Profiles', function(){
        return Profiles.find({}); 
    });
        
    // Meteor.users.find().observe({
        // changed : function(user) {
            // get_facebook_me(user['_id']);
        // },
        // added : function(user) {
            // get_facebook_me(user['_id']);
        // }
    // });
//     
    Meteor.publish('Msgs', function (room, host) {
        return Msgs.find({room: room, host: host}); 
    });
    
    msg_set = function(action, msg, room, host) {
        var user_name = Meteor.user()['profile']['name'];
        if (!user_name || !msg)
            return;
        Msg.set(user_name, action, msg, room, host);
    }
    
    Meteor.methods({
        says : function(msg, room, host){
            msg_set(' says: ', msg, room, host);
        },
        joined : function(room, host){
            msg_set('', ' joined room...', room, host);
        },
        left : function(room, host){
            msg_set('', ' left room...', room, host);
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