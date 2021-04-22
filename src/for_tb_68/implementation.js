const { ExtensionCommon } = ChromeUtils.import(
  'resource://gre/modules/ExtensionCommon.jsm'
);

const { ExtensionSupport } = ChromeUtils.import(
  'resource:///modules/ExtensionSupport.jsm'
);

this.org_pqrs_disable_dnd_tb_v2 = class extends ExtensionCommon.ExtensionAPI {
  static showPrompt = false;

  static getExtensionId() {
    return 'disable_dnd_tb_v2@pqrs.org';
  }

  static handleEvent(event) {
    event.stopPropagation();
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
                    org_pqrs_disable_dnd_tb_v2.handleEvent,
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
            'dragstart',
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
