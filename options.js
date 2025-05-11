document.addEventListener("DOMContentLoaded", () => {
  const keyInput = document.getElementById("cohereKey");
  const statusDiv = document.getElementById("status");

  // Load saved key
  chrome.storage.local.get(["cohereKey"], (result) => {
    if (result.cohereKey) {
      keyInput.value = result.cohereKey;
    }
  });

  // Save key on button click
  document.getElementById("saveBtn").addEventListener("click", () => {
    const cohereKey = keyInput.value.trim();
    chrome.storage.local.set({ cohereKey }, () => {
      statusDiv.textContent = "API key saved!";
      setTimeout(() => (statusDiv.textContent = ""), 2000);
    });
  });
});
