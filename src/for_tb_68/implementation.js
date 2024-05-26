const { ExtensionCommon } = ChromeUtils.import(
  'resource://gre/modules/ExtensionCommon.jsm'
);

const { ExtensionSupport } = ChromeUtils.import(
  'resource:///modules/ExtensionSupport.jsm'
);

const extensionId = 'disable_dnd_tb_v2@pqrs.org';

//
// Configurations
//

let allowFolderMovementIfDragStartsWithShiftKey = false;

let updateFolderTreeIntervalID;

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
  if (allowFolderMovementIfDragStartsWithShiftKey && event.shiftKey) {
    return;
  }

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
              // Thunderbird 115 takes a while for the folderTree to load, so retry until it is found.
              updateFolderTreeIntervalID = window.setInterval(() => {
                const folderTree = findFolderTree(window);

                if (folderTree !== null) {
                  folderTree.addEventListener(
                    'dragstart',
                    handleDragStartEvent,
                    true
                  );

                  if (updateFolderTreeIntervalID !== undefined) {
                    window.clearInterval(updateFolderTreeIntervalID);
                    updateFolderTreeIntervalID = undefined;
                  }
                }
              }, 1000);
            },
          });
        },

        setAllowFolderMovementIfDragStartsWithShiftKey(value) {
          allowFolderMovementIfDragStartsWithShiftKey = value;
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

        if (updateFolderTreeIntervalID !== undefined) {
          window.clearInterval(updateFolderTreeIntervalID);
          updateFolderTreeIntervalID = undefined;
        }
      }
    }
    ExtensionSupport.unregisterWindowListener(extensionId);
  }
};
