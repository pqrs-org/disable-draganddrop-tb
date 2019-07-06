var { ExtensionCommon } = ChromeUtils.import(
  'resource://gre/modules/ExtensionCommon.jsm'
);

var { ExtensionSupport } = ChromeUtils.import(
  'resource:///modules/ExtensionSupport.jsm'
);

const addonID = 'disable_dnd_tb_v2@pqrs.org';

const handleEvent = event => {
  event.stopPropagation();
};

function startup(_data, _reason) {
  ExtensionSupport.registerWindowListener(addonID, {
    chromeURLs: ['chrome://messenger/content/messenger.xul'],
    onLoadWindow: function(window) {
      const folderTree = window.document.getElementById('folderTree');
      if (folderTree !== null) {
        folderTree.addEventListener('dragstart', handleEvent, true);
      }
    }
  });
}

function shutdown(_data, _reason) {
  for (let window of ExtensionSupport.openWindows) {
    if (window.location.href == 'chrome://messenger/content/messenger.xul') {
      const folderTree = window.document.getElementById('folderTree');
      if (folderTree !== null) {
        folderTree.removeEventListener('dragstart', handleEvent, true);
      }
    }
  }
  ExtensionSupport.unregisterWindowListener(addonID);
}
