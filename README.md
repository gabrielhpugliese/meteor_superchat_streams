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

```html
<template name="index">
  {{> chatroom}}
</template>
```

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
