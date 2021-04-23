const { ExtensionCommon } = ChromeUtils.import(
  'resource://gre/modules/ExtensionCommon.jsm'
);

const { ExtensionSupport } = ChromeUtils.import(
  'resource:///modules/ExtensionSupport.jsm'
);

const promptService = Components.classes[
  '@mozilla.org/embedcomp/prompt-service;1'
].getService(Components.interfaces.nsIPromptService);

const extensionId = 'disable_dnd_tb_v2@pqrs.org';

let showPrompt = false;

const handleDragStartEvent = (event) => {
  if (!showPrompt) {
    event.stopPropagation();
  }
};

const handleDropEvent = (event) => {
  if (showPrompt) {
    if (
      promptService.confirm(
        null,
        'Moving folder',
        'Do you really want to move this folder?'
      )
    ) {
      event.stopPropagation();
      return false;
    }
  }
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
              const folderTree = window.document.getElementById('folderTree');
              if (folderTree !== null) {
                folderTree.addEventListener(
                  'dragstart',
                  handleDragStartEvent,
                  true
                );
                folderTree.addEventListener('drop', handleDropEvent, true);
              }
            },
          });
        },
        setShowPrompt(value) {
          showPrompt = value;
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
        const folderTree = window.document.getElementById('folderTree');
        if (folderTree !== null) {
          folderTree.removeEventListener(
            'dragstart',
            handleDragStartEvent,
            true
          );
          folderTree.removeEventListener('drop', handleDropEvent, true);
        }
      }
    }
    ExtensionSupport.unregisterWindowListener(extensionId);
  }
};
