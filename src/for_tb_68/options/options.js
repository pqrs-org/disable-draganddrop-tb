document.addEventListener('DOMContentLoaded', () => {
  browser.storage.sync.get('extensionConfig').then((res) => {
    document.querySelector('#show-prompt').checked = res.showPrompt ?? false;
  });
});

document.querySelector('#show-prompt').addEventListener('change', () => {
  browser.storage.sync.set({
    showPrompt: document.querySelector('#show-prompt').checked,
  });
});
