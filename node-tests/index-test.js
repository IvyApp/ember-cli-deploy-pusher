'use strict';

var assert = require('assert');

describe('the index', function() {
  var subject, mockUi;

  beforeEach(function() {
    subject = require('../index');

    mockUi = {
      messages: [],

      write: function() {},

      writeLine: function(message) {
        this.messages.push(message);
      }
    };
  });

  it('has a name', function() {
    var plugin = subject.createDeployPlugin({
      name: 'test-plugin'
    });

    assert.equal(plugin.name, 'test-plugin');
  });

  it('implements the correct hooks', function() {
    var plugin = subject.createDeployPlugin({
      name: 'test-plugin'
    });

    assert.equal(typeof plugin.willDeploy, 'function');
    assert.equal(typeof plugin.willBuild, 'function');
    assert.equal(typeof plugin.build, 'function');
    assert.equal(typeof plugin.didBuild, 'function');
    assert.equal(typeof plugin.willPrepare, 'function');
    assert.equal(typeof plugin.prepare, 'function');
    assert.equal(typeof plugin.didPrepare, 'function');
    assert.equal(typeof plugin.willUpload, 'function');
    assert.equal(typeof plugin.upload, 'function');
    assert.equal(typeof plugin.didUpload, 'function');
    assert.equal(typeof plugin.willActivate, 'function');
    assert.equal(typeof plugin.activate, 'function');
    assert.equal(typeof plugin.didActivate, 'function');
    assert.equal(typeof plugin.didDeploy, 'function');
    assert.equal(typeof plugin.teardown, 'function');
    assert.equal(typeof plugin.fetchRevisions, 'function');
    assert.equal(typeof plugin.displayRevisions, 'function');
    assert.equal(typeof plugin.didFail, 'function');
  });

  describe('configure hook', function() {
    it('resolves if config is ok', function() {
      var plugin = subject.createDeployPlugin({
        name: 'pusher'
      });

      var context = {
        ui: mockUi,

        config: {
          pusher: {
            appId: 'app-id',
            key: 'key',
            secret: 'secret'
          }
        }
      };

      plugin.beforeHook(context);
      plugin.configure(context);

      assert.ok(true); // it didn't throw
    });

    it('throws if required configuration is missing', function() {
      var plugin = subject.createDeployPlugin({
        name: 'pusher'
      });

      var context = {
        ui: mockUi,

        config: {
          pusher: {
          }
        }
      };

      plugin.beforeHook(context);

      assert.throws(function() {
        plugin.configure(context);
      }, /Missing required config/);
    });
  });

  [
    'willDeploy',
    'willBuild',
    'build',
    'didBuild',
    'willPrepare',
    'prepare',
    'didPrepare',
    'willUpload',
    'upload',
    'didUpload',
    'willActivate',
    'activate',
    'didActivate',
    'didDeploy',
    'teardown',
    'fetchRevisions',
    'displayRevisions',
    'didFail'
  ].forEach(function(hookName) {
    describe(hookName + ' hook', function() {
      it('is invoked correctly', function() {
        var plugin = subject.createDeployPlugin({
          name: 'pusher'
        });

        var pusherClient = {
        };

        var context = {
          ui: mockUi,

          config: {
            pusher: {
              pusherClient: pusherClient
            }
          }
        };

        context.config.pusher[hookName] = function(givenContext) {
          assert.equal(givenContext, context);

          return function(givenClient) {
            assert.equal(givenClient, pusherClient);
          };
        };

        plugin.beforeHook(context);
        plugin.configure(context);

        plugin[hookName](context);
      });
    });
  });
});
