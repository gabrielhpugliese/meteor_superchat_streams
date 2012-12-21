get_parent_param = function(){
    // This is used when inside an iframe
    var parent;
    try{
        parent = get_params()['parent'];
    } catch(err) {
    }
    return parent ? parent : window.location.hostname;
}

get_params = function(){
    var params = window.location.href.split('?'),
        params_dict = Object(),
        p_split;
    if (params.length == 2){
        params = params[1].split('&');
        for(var i in params){
            if (params.hasOwnProperty(i)){
                p_split = params[i].split('=');
                params_dict[p_split[0]] = p_split[1];
            }
        }
    }
    return params_dict;
}

if (Meteor.isClient) {
    var PARENT = get_parent_param();
    
    Meteor.autosubscribe(function(){
        Meteor.subscribe('Rooms', PARENT);
        Meteor.subscribe('Profiles');
    });


    Template.entrance.rooms = function() {
        return Rooms.find({
            host : PARENT
        });
    };

    Template.entrance.users = function() {
        return Names.find({
            host : PARENT
        });
    };

    Template.entrance.joined = function() {
        if (Session.get('joined')) {
            return true;
        }
        return false;
    };
    
    Template.chatroom.msgs = function() {
        return Msgs.find({
            room : Session.get('room'),
            host : PARENT
        });
    };
    
    Template.chatroom.get_pic_square = function(user_id) {
        var profile = Meteor.users.findOne(user_id);
        
        if (profile && profile['pic_square'])
            return profile['pic_square'];
        return;
    };
    
    Template.chatroom.room_actual = function() {
        return Session.get('room');
    };

    Template.chatroom.scroll_to_bottom = function() {
        Meteor.defer(function() {
            try {
                var chat = document.getElementById('chat');
                chat.scrollTop = chat.scrollHeight;
            } catch(err) {
            }
        });
    };

    send_msg = function(e) {
        e = e || event;
        if ((e.keyCode || event.which || event.charCode || 0) == 13 ||
            e.type == 'click') {
            var $msg_box = document.getElementById('msg'),
                msg = $msg_box.value.trim(),
                room = Session.get('room');
                
            Meteor.call('says', msg, room, PARENT, function(){
                $msg_box.value = ''; 
            });
        }
    };

    Template.entrance.events = {
        'click button.room-enter' : function() {
            var room = this.name;
            
            if (Meteor.user())
                name = Meteor.user()['profile']['name'];
            else return;
                
            Session.set('joined', true);
            Session.set('room', room);
            Meteor.autosubscribe(function(){
                Meteor.subscribe('Msgs', room, PARENT);
            });
            Meteor.call('joined', room, PARENT, function(){});
        },
        'click button.msg-send' : send_msg,
        'keydown #msg': send_msg,
        'click button.room-exit' : function() {
            var room = Session.get('room');
            Meteor.call('left', room, PARENT, function(){
                Session.set('joined', false);
                Session.set('room', '');
            });
        }
    };
}

