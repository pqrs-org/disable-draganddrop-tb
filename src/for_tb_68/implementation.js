const { ExtensionCommon } = ChromeUtils.import(
  'resource://gre/modules/ExtensionCommon.jsm'
);

const { ExtensionSupport } = ChromeUtils.import(
  'resource:///modules/ExtensionSupport.jsm'
);

const dragService = Components.classes[
  '@mozilla.org/widget/dragservice;1'
].getService(Components.interfaces.nsIDragService);

const promptService = Components.classes[
  '@mozilla.org/embedcomp/prompt-service;1'
].getService(Components.interfaces.nsIPromptService);

const extensionId = 'disable_dnd_tb_v2@pqrs.org';

//
// Configurations
//

let showPrompt = false;

//
// States
//

const handleDragStartEvent = (event) => {
  if (!showPrompt) {
    event.stopPropagation();
    return;
  }
};

const handleDropEvent = (event) => {
  // When showPrompt is true, we listen `drop` event and show a prompt.
  // However, the `drop` event is also triggered by a mail message movement.
  // So, we refer `dataTransfer` to determine the dragged item is folder or mail.
  //
  // Note:
  // We have to use `dragService.getCurrentSession().dataTransfer` instead of `event.dataTransfer`.
  // These values are the same, but if you access `event.dataTransfer`,
  // the folder will be moved even if you cancel at the prompt.

  const dt = dragService.getCurrentSession().dataTransfer;
  const isFolderMovement = dt.types.indexOf('text/x-moz-folder') !== -1;

  if (isFolderMovement) {
    if (showPrompt) {
      // Canceling a drag anywhere other than `dragstart` requires very tricky way.
      //
      // First, let's look at how moving a folder works.
      // Moving a folder is not done in the normal event handler.
      // In fact, the folder movement is performed in the following flow.
      //
      // 1. `folderObserver::onDrop` defined in `msgMail3PaneWindow.js` is called.
      //    (This is registered in `folderTreeBuilder.addObserver`.)
      // 2. `onDrop` calls `DropOnFolderTree` in `messengerdnd.js`.
      // 3. `DropOnFolderTree` calls `drop` in `folderPane.js`.
      // 4. `drop` performs the folder movement.
      //
      // For this `onDrop`, there is no way to cancel or interrupt it.
      // Therefore, it intentionally raises an error inside these processes to prevent the folder movement.
      //
      // We will use the fact that promptService internally rewrites event.dataTransfer.
      // If `_onDragDrop` in `folderPane.js` is called, the `_currentTransfer` will be set to null,
      // and `drop` raises an error because `dt` is null. It prevent the folder movement.
      //
      // We call `stopPropagation` to avoid this error only when the folder movement is approved.

      const approval = promptService.confirm(
        null,
        'Moving folder',
        'Do you really want to move this folder?'
      );
      if (approval) {
        event.stopPropagation();
        return;
      }
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
