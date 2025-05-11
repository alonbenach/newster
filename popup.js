document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("cohereKey");
  const status = document.getElementById("status");

  // ❌ Removed auto-fill on load — box stays empty unless user types

  document.getElementById("saveBtn").addEventListener("click", () => {
    const cohereKey = input.value.trim();
    if (!cohereKey) return;

    chrome.storage.local.set({ cohereKey }, () => {
      input.value = ""; // ✅ This will now stay cleared
      status.textContent = "Key saved!";
      status.style.color = "green";

      setTimeout(() => {
        status.textContent = "";
        status.style.color = "";
      }, 2000);
    });
  });
});
