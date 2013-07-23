saveUserProfile = function(user){
    if (user.superchat.pic_square)
        return;

    if ('facebook' in user['services']){
        id = user['services']['facebook']['id'];
        pic_square = 'http://graph.facebook.com/'+id+'/picture?type=square';
        url = 'https://www.facebook.com/'+id;
    } else if ('google' in user['services']){
        id = user['services']['google']['id'];
        pic_square = 'https://www.google.com/s2/photos/profile/'+id;
        url = 'https://plus.google.com/u/0/'+id;
    }
    user.superchat['pic_square'] = pic_square;
    user.superchat['url'] = url;
    user.superchat.name = user.profile.name;

    return user;
}
