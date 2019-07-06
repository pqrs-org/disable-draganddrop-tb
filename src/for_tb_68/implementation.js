var { ExtensionCommon } = ChromeUtils.import(
  'resource://gre/modules/ExtensionCommon.jsm'
);

var { ExtensionSupport } = ChromeUtils.import(
  'resource:///modules/ExtensionSupport.jsm'
);

const addonID = 'disable_dnd_tb@pqrs.org';

// This is the important part. It implements the functions and events defined in schema.json.
// The variable must have the same name you've been using so far, "myapi" in this case.
var myapi = class extends ExtensionCommon.ExtensionAPI {
  getAPI(context) {
    const handleEvent = event => {
      event.stopPropagation();
    };

    return {
      myapi: {
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
        }
      }
    };
  }
};
