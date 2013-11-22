saveUserProfile = function(user){
    if (user.superchat.pic_square) {
        return;
    }

    if ('facebook' in user['services']){
        id = user['services']['facebook']['id'];
        pic_square = 'http://graph.facebook.com/'+id+'/picture?type=square';
        url = 'https://www.facebook.com/'+id;
    } else if ('google' in user['services']){
        id = user['services']['google']['id'];
        pic_square = 'http://www.google.com/s2/photos/profile/'+id;
        url = 'https://plus.google.com/u/0/'+id;
    }
    
    var pictureOK = Meteor.http.get(pic_square);
    user.superchat['pic_square'] = pictureOK ? pic_square : Superchat.defaultProfilePicture;
    user.superchat['url'] = url;
    user.superchat.name = user.profile.name;

    return user;
}
