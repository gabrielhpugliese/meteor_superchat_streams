Package.describe({
  summary: "Chat with Github Flavored Markdown and social login"
});

Package.on_use(function (api, where) {
  // Client
  api.use([
    'startup',
    'session',
    'templating',
    'less'
  ], 'client');
  api.use(['marked'], 'client');

  api.add_files([
		 'client/stylesheets/highlight/default.css',
		 'client/stylesheets/superchat.less',
		 'client/views/chatroom.html',
		 'client/views/chatroom.js',
		 'client/views/layout.html',
		 'client/application.js'
		 ], 'client');
  api.add_files(['client/compatibility/highlight.pack.js',
                 'client/compatibility/jquery.nicescroll.min.js',
                 'client/compatibility/keyboard.js'
                 ], 'client', {raw: true});

  // Both
  api.add_files(['collections/models.js'], ['client', 'server']);

  // Server
  api.add_files(['server/lib/utils.js',
	             'server/publications.js'
		         ], 'server');

});
