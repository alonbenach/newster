document.addEventListener("DOMContentLoaded", () => {
  const allowBtn = document.getElementById("allowDomainBtn");

  allowBtn.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = new URL(tabs[0].url);
      const domain = url.hostname;

      chrome.storage.local.get(["allowedDomains"], (result) => {
        const domains = result.allowedDomains || [];

        if (!domains.includes(domain)) {
          domains.push(domain);
          chrome.storage.local.set({ allowedDomains: domains }, () => {
            alert(`Summaries enabled for ${domain}`);
          });
        } else {
          alert(`${domain} is already enabled.`);
        }
      });
    });
  });
});
