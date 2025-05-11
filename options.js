document.addEventListener("DOMContentLoaded", () => {
  const keyInput = document.getElementById("grokKey");
  const statusDiv = document.getElementById("status");

  // Load saved key
  chrome.storage.local.get(["grokKey"], (result) => {
    if (result.grokKey) {
      keyInput.value = result.grokKey;
    }
  });

  // Save key on button click
  document.getElementById("saveBtn").addEventListener("click", () => {
    const grokKey = keyInput.value.trim();
    chrome.storage.local.set({ grokKey }, () => {
      statusDiv.textContent = "API key saved!";
      setTimeout(() => (statusDiv.textContent = ""), 2000);
    });
  });
});
