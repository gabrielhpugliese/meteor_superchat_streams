Meteor.setInterval(function () {
    Meteor.users.find({'profile.canChat': false}).forEach(function (user) {
        var now = +(new Date());
        if (user.profile.whenCanChat >= now)
            return;
        Meteor.users.update({_id: user._id}, {
            $set: {'profile.canChat': true}
        });
    });
}, 30 * 1000)
