const allowFolderMovementIfDragStartsWithShiftKeyCheckbox =
  document.querySelector('#allowFolderMovementIfDragStartsWithShiftKey');

document.addEventListener('DOMContentLoaded', () => {
  // We have to specify `browser.storage.local.get` argument to avoid this issue.
  // https://thunderbird.topicbox.com/groups/addons/T46e96308f41c0de1-Md71abae9ff7506f371f5e323/issues-with-browser-storage-local-get
  browser.storage.local
    .get('allowFolderMovementIfDragStartsWithShiftKey')
    .then((res) => {
      allowFolderMovementIfDragStartsWithShiftKeyCheckbox.checked =
        res.allowFolderMovementIfDragStartsWithShiftKey ?? false;
    });
});

allowFolderMovementIfDragStartsWithShiftKeyCheckbox.addEventListener(
  'change',
  () => {
    // We use storage.local instead of storage.sync because storage.sync is not persisted.
    browser.storage.local.set({
      allowFolderMovementIfDragStartsWithShiftKey: document.querySelector(
        '#allowFolderMovementIfDragStartsWithShiftKey'
      ).checked,
    });
  }
);
