const { ExtensionCommon } = ChromeUtils.import(
  'resource://gre/modules/ExtensionCommon.jsm'
);

const { ExtensionSupport } = ChromeUtils.import(
  'resource:///modules/ExtensionSupport.jsm'
);

const promptService = Components.classes[
  '@mozilla.org/embedcomp/prompt-service;1'
].getService(Components.interfaces.nsIPromptService);

this.org_pqrs_disable_dnd_tb_v2 = class extends ExtensionCommon.ExtensionAPI {
  static showPrompt = false;

  static getExtensionId() {
    return 'disable_dnd_tb_v2@pqrs.org';
  }

  static handleDragStartEvent(event) {
    if (!org_pqrs_disable_dnd_tb_v2.showPrompt) {
      event.stopPropagation();
    }
  }

  static handleDropEvent(event) {
    if (org_pqrs_disable_dnd_tb_v2.showPrompt) {
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
  }

  getAPI(context) {
    context.callOnClose(this);
    return {
      org_pqrs_disable_dnd_tb_v2: {
        init() {
          ExtensionSupport.registerWindowListener(
            org_pqrs_disable_dnd_tb_v2.getExtensionId(),
            {
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
                    org_pqrs_disable_dnd_tb_v2.handleDragStartEvent,
                    true
                  );
                  folderTree.addEventListener(
                    'drop',
                    org_pqrs_disable_dnd_tb_v2.handleDropEvent,
                    true
                  );
                }
              },
            }
          );
        },
        setShowPrompt(showPrompt) {
          org_pqrs_disable_dnd_tb_v2.showPrompt = showPrompt;
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
            'drop',
            org_pqrs_disable_dnd_tb_v2.handleEvent,
            true
          );
        }
      }
    }
    ExtensionSupport.unregisterWindowListener(
      org_pqrs_disable_dnd_tb_v2.getExtensionId()
    );
  }
};
