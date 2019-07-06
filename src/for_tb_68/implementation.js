var { ExtensionCommon } = ChromeUtils.import(
  'resource://gre/modules/ExtensionCommon.jsm'
);

var { ExtensionSupport } = ChromeUtils.import(
  'resource:///modules/ExtensionSupport.jsm'
);

var { Services } = ChromeUtils.import('resource://gre/modules/Services.jsm');

const addonID = 'disable_dnd_tb@pqrs.org';

// This is the important part. It implements the functions and events defined in schema.json.
// The variable must have the same name you've been using so far, "myapi" in this case.
var myapi = class extends ExtensionCommon.ExtensionAPI {
  getAPI(context) {
    const handleEvent = event => {
      event.stopPropagation();
    };

    return {
      // Again, this key must have the same name.
      myapi: {
        // A function.
        sayHello: async function(name) {
          Services.wm
            .getMostRecentWindow('mail:3pane')
            .alert('Hello ' + name + '!');
        },

        disableFolderTreeDrag: function() {
          ExtensionSupport.registerWindowListener(addonID, {
            chromeURLs: ['chrome://messenger/content/messenger.xul'],
            onLoadWindow: function(window) {
              const folderTree = window.document.getElementById('folderTree');
              if (folderTree !== null) {
                folderTree.addEventListener('dragstart', handleEvent, true);
              }
            }
          });
        },

        enableFolderTreeDrag: function() {
          for (let window of ExtensionSupport.openWindows) {
            if (
              window.location.href == 'chrome://messenger/content/messenger.xul'
            ) {
              const folderTree = window.document.getElementById('folderTree');
              if (folderTree !== null) {
                folderTree.removeEventListener('dragstart', handleEvent, true);
              }
            }
          }
          ExtensionSupport.unregisterWindowListener(addonID);
        },

        // An event. Most of this is boilerplate you don't need to worry about, just copy it.
        onToolbarClick: new ExtensionCommon.EventManager({
          context,
          name: 'myapi.onToolbarClick',
          // In this function we add listeners for any events we want to listen to, and return a
          // function that removes those listeners. To have the event fire in your extension,
          // call fire.async.
          register(fire) {
            function callback(event, id, x, y) {
              return fire.async(id, x, y);
            }

            windowListener.add(callback);
            return function() {
              windowListener.remove(callback);
            };
          }
        }).api()
      }
    };
  }
};

// This object is just what we're using to listen for toolbar clicks. The implementation isn't
// what this example is about, but you might be interested as it's a common pattern. We count the
// number of callbacks waiting for events so that we're only listening if we need to be.
var windowListener = new (class extends ExtensionCommon.EventEmitter {
  constructor() {
    super();
    this.callbackCount = 0;
  }

  handleEvent(event) {
    let toolbar = event.target.closest('toolbar');
    windowListener.emit(
      'toolbar-clicked',
      toolbar.id,
      event.clientX,
      event.clientY
    );
  }

  add(callback) {
    this.on('toolbar-clicked', callback);
    this.callbackCount++;

    if (this.callbackCount == 1) {
      ExtensionSupport.registerWindowListener('windowListener', {
        chromeURLs: ['chrome://messenger/content/messenger.xul'],
        onLoadWindow: function(window) {
          let toolbox = window.document.getElementById('mail-toolbox');
          toolbox.addEventListener('click', windowListener.handleEvent);
        }
      });
    }
  }

  remove(callback) {
    this.off('toolbar-clicked', callback);
    this.callbackCount--;

    if (this.callbackCount == 0) {
      for (let window of ExtensionSupport.openWindows) {
        if (
          window.location.href == 'chrome://messenger/content/messenger.xul'
        ) {
          let toolbox = window.document.getElementById('mail-toolbox');
          toolbox.removeEventListener('click', this.handleEvent);
        }
      }
      ExtensionSupport.unregisterWindowListener('windowListener');
    }
  }
})();
