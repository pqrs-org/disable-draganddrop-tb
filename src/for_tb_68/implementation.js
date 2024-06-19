const { ExtensionCommon } = ChromeUtils.import(
  'resource://gre/modules/ExtensionCommon.jsm'
);

const { ExtensionSupport } = ChromeUtils.import(
  'resource:///modules/ExtensionSupport.jsm'
);

const extensionId = 'disable_dnd_tb_v2@pqrs.org';
const registeredDatasetKey = 'registered.disableDndTbV2.pqrs.org';
const browserIdDatasetKey = 'browserId.disableDndTbV2.pqrs.org';

//
// Configurations
//

let allowFolderMovementIfDragStartsWithShiftKey = false;

let updateFolderTreeIntervalID;

const findFolderTrees = (window) => {
  const folderTrees = [];

  // For Thunderbird 115
  for (let browser of window.document.querySelectorAll('browser')) {
    if (browser.contentWindow !== null) {
      const folderTree =
        browser.contentWindow.document.getElementById('folderTree');
      if (folderTree != null) {
        folderTree.dataset[browserIdDatasetKey] = browser.id;
        folderTrees.push(folderTree);
      }
    }
  }

  // For Thunderbird 102
  {
    const folderTree = window.document.getElementById('folderTree');
    if (folderTree != null) {
      folderTree.dataset[browserIdDatasetKey] = '';
      folderTrees.push(folderTree);
    }
  }

  return folderTrees;
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
              // Due to the following reasons, we will use setInterval to perform periodic processing:
              // - In Thunderbird 115 and later, it takes some time for the folderTree to appear, so we need to retry until it becomes available.
              // - We also need to handle newly opened tabs.
              updateFolderTreeIntervalID = window.setInterval(() => {
                findFolderTrees(window).forEach((folderTree) => {
                  if (!folderTree.dataset[registeredDatasetKey]) {
                    folderTree.dataset[registeredDatasetKey] = true;

                    console.log(
                      `disable_dnd_tb_v2 folderTree.addEventListener ${folderTree.dataset[browserIdDatasetKey]}`
                    );
                    folderTree.addEventListener(
                      'dragstart',
                      handleDragStartEvent,
                      true
                    );
                  }
                });
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
        findFolderTrees(window).forEach((folderTree) => {
          delete folderTree.dataset[registeredDatasetKey];

          console.log(
            `disable_dnd_tb_v2 folderTree.removeEventListener ${folderTree.dataset[browserIdDatasetKey]}`
          );
          folderTree.removeEventListener(
            'dragstart',
            handleDragStartEvent,
            true
          );
        });

        if (updateFolderTreeIntervalID !== undefined) {
          window.clearInterval(updateFolderTreeIntervalID);
          updateFolderTreeIntervalID = undefined;
        }
      }
    }
    ExtensionSupport.unregisterWindowListener(extensionId);
  }
};
