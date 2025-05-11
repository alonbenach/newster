document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("cohereKey");
  const status = document.getElementById("status");

  chrome.storage.local.get(["cohereKey"], (result) => {
    if (result.cohereKey) input.value = result.cohereKey;
  });

  document.getElementById("saveBtn").addEventListener("click", () => {
    const newKey = input.value.trim();
    if (!newKey) return;

    chrome.storage.local.set({ cohereKey: newKey }, () => {
      input.value = ""; //
      status.textContent = "Key saved!";
      status.style.color = "green";

      setTimeout(() => {
        status.textContent = "";
        status.style.color = "";
      }, 2000);
    });
  });
});
