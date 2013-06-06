Package.describe({
  summary: "Chat with Github Flavored Markdown and social login"
});

Package.on_use(function (api, where) {
  // Client
  api.use([
  	'deps',
    'startup',
    'session',
    'templating',
    'less',
    'jquery',
    'bootstrap',
    'mini-pages',
    'marked'
  ], 'client');

  api.add_files([
		 'client/stylesheets/highlight/default.css',
		 'client/stylesheets/superchat.less',
		 'client/views/chatroom.html',
		 'client/views/chatroom.js',
		 'client/application.js'
		 ], 'client');
  api.add_files(['client/compatibility/highlight.pack.js',
  				 'client/compatibility/jquery.nicescroll.min.js',
                 'client/compatibility/keyboard.js'
                 ], 'client', {raw: true});

  // Both
  api.use(['accounts-base'], ['client', 'server']);
  api.add_files(['collections/models.js'], ['client', 'server']);

  // Server
  api.add_files(['server/lib/utils.js',
	             'server/publications.js'
		         ], 'server');

});
