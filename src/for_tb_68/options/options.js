const allowFolderMovementIfDragStartsWithAltCheckbox = document.querySelector(
  '#allowFolderMovementIfDragStartsWithAlt'
);

document.addEventListener('DOMContentLoaded', () => {
  // We have to specify `browser.storage.local.get` argument to avoid this issue.
  // https://thunderbird.topicbox.com/groups/addons/T46e96308f41c0de1-Md71abae9ff7506f371f5e323/issues-with-browser-storage-local-get
  browser.storage.local
    .get('allowFolderMovementIfDragStartsWithAlt')
    .then((res) => {
      allowFolderMovementIfDragStartsWithAltCheckbox.checked =
        res.allowFolderMovementIfDragStartsWithAlt ?? false;
    });
});

allowFolderMovementIfDragStartsWithAltCheckbox.addEventListener(
  'change',
  () => {
    // We use storage.local instead of storage.sync because storage.sync is not persisted.
    browser.storage.local.set({
      allowFolderMovementIfDragStartsWithAlt: document.querySelector(
        '#allowFolderMovementIfDragStartsWithAlt'
      ).checked,
    });
  }
);
