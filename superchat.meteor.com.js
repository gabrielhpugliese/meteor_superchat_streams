if (Meteor.isClient) {
  new ForkMe({
    user: 'gabrielhpugliese',
    repo: 'meteor_superchat',
    ribbon: {
      color: 'red',
      position: 'left'
    },
  });
  
WebFontConfig = {
    google: { families: [ 'Lato:400,700:latin' ] }
};
(function() {
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
})();

  Meteor.pages({
    '/': {to: 'index', before: setPath}
  });

  function setPath () {
    Path.set(Meteor.router.path());
  }
}
