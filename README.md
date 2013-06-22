Meteor SuperChat
================

Smart package for SuperChat. Superchat is a chat that includes Social Login and Github Flavored Markdown.

## Demo

http://superchat.meteor.com

## Install

To install in a new project:
```bash
> mrt add superchat
```

To update an existing project:
```bash
> mrt update superchat
```

## Quick Start

You need to configure at least one kind of account. Supported languages now are:
* Facebook
* Google
* Twitter

For example, with Google:

```bash
meteor add accounts-google
```

```html
<template name="index">
  {{> chatroom}}
</template>
```

## Configuration

If you don't want to have a global chat for entire website, you can set a Path so you can have a different chat box for each Path you set.
What's needed to do on javascript part is set a Path. Path is a reactive source of current page path (like window.location.pathname).
So, whenever it changes, it must be updated calling ```Path.set(path)```

### Example with mini-pages
```javascript
Meteor.pages({
  '/': {to: 'index', before: setPath}
});

function setPath () {
  Path.set(Meteor.router.path());
}
```

### Example with router
```javascript
Meteor.Router.add({
  '/': { to: 'index', and: setPath}
});

function setPath () {
  Path.set(Meteor.Router.page());
}
```

### Making height responsive
```
Template.parentTemplate.rendered = function() {
	$(window).resize(function () {
		var height = $(this).height(); // you can set a value you want here
		$('#chat-wrapper').height(height);
	});
	$(window).resize(); // trigger the resize
}
```
