const { ExtensionCommon } = ChromeUtils.import(
  'resource://gre/modules/ExtensionCommon.jsm'
);

const { ExtensionSupport } = ChromeUtils.import(
  'resource:///modules/ExtensionSupport.jsm'
);

const extensionId = 'disable_dnd_tb_v2@pqrs.org';

const findFolderTree = (window) => {
  // For Thunderbird 115
  for (let browser of window.document.querySelectorAll('browser')) {
    if (browser.contentWindow !== null) {
      const folderTree =
        browser.contentWindow.document.getElementById('folderTree');
      if (folderTree !== null) {
        return folderTree;
      }
    }
  }

  // For Thunderbird 102
  return window.document.getElementById('folderTree');
};

const handleDragStartEvent = (event) => {
  event.stopPropagation();
  return;
};

this.org_pqrs_disable_dnd_tb_v2 = class extends ExtensionCommon.ExtensionAPI {
  getAPI(context) {
    context.callOnClose(this);
    return {
      org_pqrs_disable_dnd_tb_v2: {
        init() {
          ExtensionSupport.registerWindowListener(extensionId, {
            // Before Thunderbird 74, messenger.xhtml was messenger.xul.
            chromeURLs: [
              'chrome://messenger/content/messenger.xhtml',
              'chrome://messenger/content/messenger.xul',
            ],
            onLoadWindow(window) {
              const folderTree = findFolderTree(window);
              console.log({ folderTree });

              if (folderTree !== null) {
                folderTree.addEventListener(
                  'dragstart',
                  handleDragStartEvent,
                  true
                );
              }
            },
          });
        },
      },
    };
  }

  close() {
    for (let window of ExtensionSupport.openWindows) {
      if (
        window.location.href === 'chrome://messenger/content/messenger.xhtml' ||
        window.location.href === 'chrome://messenger/content/messenger.xul'
      ) {
        const folderTree = findFolderTree(window);
        if (folderTree !== null) {
          folderTree.removeEventListener(
            'dragstart',
            handleDragStartEvent,
            true
          );
        }
      }
    }
    ExtensionSupport.unregisterWindowListener(extensionId);
  }
};
