document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("cohereKey");
  const status = document.getElementById("status");

  // Load key
  chrome.storage.local.get(["cohereKey"], (result) => {
    if (result.cohereKey) input.value = result.cohereKey;
  });

  // Save key
  document.getElementById("saveBtn").addEventListener("click", () => {
    const cohereKey = input.value.trim();
    chrome.storage.local.set({ cohereKey }, () => {
      status.textContent = "Key saved!";
      setTimeout(() => (status.textContent = ""), 2000);
    });
  });
});
