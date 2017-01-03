/* jshint node: true */
'use strict';

var DeployPluginBase = require('ember-cli-deploy-plugin');
var Pusher = require('pusher');

function notificationHook(hookName) {
  return function(context) {
    if (!this.readConfig('enabled')) {
      return;
    }

    var hook = this.readConfig(hookName);

    if (hook) {
      return hook.call(this, this.readConfig('pusherClient'));
    }
  };
}

module.exports = {
  name: 'ember-cli-deploy-pusher',

  createDeployPlugin: function(options) {
    var DeployPlugin = DeployPluginBase.extend({
      name: options.name,

      configure: function(/* context */) {
        this.log('validating config', { verbose: true });

        var defaultProps = Object.keys(this.defaultConfig || {});
        defaultProps.forEach(this.applyDefaultConfigProperty.bind(this));

        var requiredProps = this.requiredConfig || [];
        requiredProps.forEach(this.ensureConfigPropertySet.bind(this));

        if (this.pluginConfig.enabled) {
          if (!this.pluginConfig.pusherClient) {
            this.ensureConfigPropertySet('appId');
            this.ensureConfigPropertySet('key');
            this.ensureConfigPropertySet('secret');

            this.pluginConfig.pusherClient = new Pusher({
              appId:  this.readConfig('appId'),
              key:    this.readConfig('key'),
              secret: this.readConfig('secret')
            });
          }
        }

        this.log('config ok', { verbose: true });
      },

      defaultConfig: {
        enabled: true
      },

      willDeploy: notificationHook('willDeploy'),

      willBuild: notificationHook('willBuild'),
      build: notificationHook('build'),
      didBuild: notificationHook('didBuild'),

      willPrepare: notificationHook('willPrepare'),
      prepare: notificationHook('prepare'),
      didPrepare: notificationHook('didPrepare'),

      willUpload: notificationHook('willUpload'),
      upload: notificationHook('upload'),
      didUpload: notificationHook('didUpload'),

      willActivate: notificationHook('willActivate'),
      activate: notificationHook('activate'),
      didActivate: notificationHook('didActivate'),

      didDeploy: notificationHook('didDeploy'),

      teardown: notificationHook('teardown'),

      fetchRevisions: notificationHook('fetchRevisions'),
      displayRevisions: notificationHook('displayRevisions'),

      didFail: notificationHook('didFail')
    });

    return new DeployPlugin();
  }
};
