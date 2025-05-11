document.getElementById("rewriteBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      window.dispatchEvent(new CustomEvent("newster-rewrite-headlines"));
    },
  });

  document.getElementById("status").textContent = "Rewriting...";
  setTimeout(() => {
    document.getElementById("status").textContent = "";
  }, 2000);
});
