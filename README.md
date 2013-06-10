Meteor SuperChat
================

Smart package for SuperChat. Superchat is a chat that includes Social Login and Github Flavored Markdown.

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
<body>
  {{> chatroom}}
</body>

```

### With mini-pages
```javascript
Meteor.setInterval(function () {
    if (!Meteor.router)
        return;

    Path.set(Meteor.router.path());
}, 100);
```

### With router
```javascript
Meteor.setInterval(function () {
    if (!Meteor.Router)
        return;

    Path.set(Meteor.Router.page());
}, 100);
```
