saveProfile = function(user){
    var user = Meteor.users.findOne(user['_id']),
        pic_square,
        id;

    if (user['profile']['pic_square'])
        return;

    if ('facebook' in user['services']){
        id = user['services']['facebook']['id'];
        pic_square = 'http://graph.facebook.com/'+id+'/picture?type=square';
        url = 'https://www.facebook.com/'+id;
    } else if ('google' in user['services']){
        id = user['services']['google']['id'];
        pic_square = 'https://www.google.com/s2/photos/profile/'+id;
        url = 'https://plus.google.com/u/0/'+id;
    } else if ('twitter' in user['services']){
        id = user['services']['twitter']['screenName'];
        pic_square = 'https://api.twitter.com/1/users/profile_image/'+id;
        url = 'https://twitter.com/'+id;
    }
    user['profile']['pic_square'] = pic_square;
    user['profile']['url'] = url;

    return Meteor.users.update(user['_id'], {$set: {profile: user['profile']}});
}
