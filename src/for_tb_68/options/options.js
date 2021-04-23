const showPromptCheckbox = document.querySelector('#show-prompt');

document.addEventListener('DOMContentLoaded', () => {
  browser.storage.local.get().then((res) => {
    showPromptCheckbox.checked =
      res.showPrompt !== undefined ? res.showPrompt : false;
  });
});

showPromptCheckbox.addEventListener('change', () => {
  // We use storage.local instead of storage.sync because storage.sync is not persisted.
  browser.storage.local.set({
    showPrompt: document.querySelector('#show-prompt').checked,
  });
});
