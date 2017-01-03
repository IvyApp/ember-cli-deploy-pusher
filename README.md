# ember-cli-deploy-pusher

> An ember-cli-deploy plugin to notify [Pusher](https://pusher.com/) of successful hook executions in your deploy pipeline.

## What is an ember-cli-deploy plugin?

A plugin is an addon that can be executed as a part of the ember-cli-deploy pipeline. A plugin will implement one or more of the ember-cli-deploy's pipeline hooks.

For more information on what plugins are and how they work, please refer to the [Plugin Documentation][1].

## Quick Start

  * Install this plugin:

```sh
$ ember install ember-cli-deploy-pusher
```

  * Place the following configuration into `config/deploy.js`:

```javascript
ENV.pusher = {
  appId: '<your pusher app id>',
  key: '<your pusher key>',
  secret: '<your pusher secret>'
};
```

  * Run the pipeline

```sh
ember deploy
```

Alternatively, you can pass in a `pusherClient` instance rather than specifying `appId`, `key`, and `secret`:

```javascript
var Pusher = require('pusher');

ENV.pusher = {
  pusherClient: new Pusher({ /* ... */ });
};
```

## ember-cli-deploy Hooks Implemented

For detailed information on what plugin hooks are and how they work, please refer to the [Plugin Documentation][1].

  * `configure`

The following hooks can be used for Pusher notifications:

  * `willDeploy`
  * `willDeploy`
  * `willBuild`
  * `build`
  * `didBuild`
  * `willPrepare`
  * `prepare`
  * `didPrepare`
  * `willUpload`
  * `upload`
  * `didUpload`
  * `willActivate`
  * `activate`
  * `didActivate`
  * `didDeploy`
  * `teardown`
  * `fetchRevisions`
  * `displayRevisions`
  * `didFail`

Note that, by default, this plugin does nothing. You must override any of the above hooks in your `config/deploy.js` file to actually send notifications.

Example:

```javascript
var RSVP = require('rsvp');

ENV.pusher = {
  didActivate: function(/* context */) {
    return function(pusher) {
      var trigger = RSVP.denodeify(pusher.trigger.bind(pusher));
      return trigger('my-channel', 'my-event', { some: 'data' });
    };
  }
};
```

The above triggers a `my-event` event in the `my-channel` channel, with a data payload of `{"some": "data"}` whenever the `deploy:activate` command completes successfully. Note that your hooks should return a function which takes a single argument, the Pusher client instance.

[1]: http://ember-cli-deploy.com/docs/v0.6.x/plugins-overview/ "Plugin Documentation"
