var { ExtensionCommon } = ChromeUtils.import(
  'resource://gre/modules/ExtensionCommon.jsm'
);

var { ExtensionSupport } = ChromeUtils.import(
  'resource:///modules/ExtensionSupport.jsm'
);

const addonID = 'disable_dnd_tb@pqrs.org';

var pqrsorgApi = class extends ExtensionCommon.ExtensionAPI {
  getAPI(context) {
    const handleEvent = event => {
      event.stopPropagation();
    };

    return {
      pqrsorgApi: {
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
