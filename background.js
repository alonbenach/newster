chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchArticle") {
    fetch(request.url)
      .then((res) => res.text())
      .then((html) => {
        // Return raw HTML to be parsed in content.js
        sendResponse({ success: true, content: html });
      })
      .catch((error) => {
        console.warn("[Newster] Fetch error:", error);
        sendResponse({ success: false });
      });

    return true; // Keep the message channel open
  }
});
