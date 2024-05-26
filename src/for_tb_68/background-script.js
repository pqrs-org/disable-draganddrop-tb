//
// Options
//

// Get the stored values

// We have to specify `browser.storage.local.get` argument to avoid this issue.
// https://thunderbird.topicbox.com/groups/addons/T46e96308f41c0de1-Md71abae9ff7506f371f5e323/issues-with-browser-storage-local-get
browser.storage.local
  .get('allowFolderMovementIfDragStartsWithAlt')
  .then((res) => {
    browser.org_pqrs_disable_dnd_tb_v2.setAllowFolderMovementIfDragStartsWithAlt(
      res.allowFolderMovementIfDragStartsWithAlt ?? false
    );
  });

// Listen for changes
browser.storage.onChanged.addListener((changeData) => {
  if (changeData.allowFolderMovementIfDragStartsWithAlt !== undefined) {
    browser.org_pqrs_disable_dnd_tb_v2.setAllowFolderMovementIfDragStartsWithAlt(
      changeData.allowFolderMovementIfDragStartsWithAlt.newValue
    );
  }
});

// A simple call to force implementation.js to load. Without it, nothing happens.
browser.org_pqrs_disable_dnd_tb_v2.init();
