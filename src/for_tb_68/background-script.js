//
// Options
//

// Get the stored values
browser.storage.local.get((data) => {
  browser.org_pqrs_disable_dnd_tb_v2.setShowPrompt(data.showPrompt ?? false);
});

// Listen for changes
browser.storage.onChanged.addListener((changeData) => {
  if (changeData.showPrompt !== undefined) {
    browser.org_pqrs_disable_dnd_tb_v2.setShowPrompt(
      changeData.showPrompt.newValue
    );
  }
});

// A simple call to force implementation.js to load. Without it, nothing happens.
browser.org_pqrs_disable_dnd_tb_v2.init();
