const HEADLINE_SELECTORS = [
  "h1",
  "h2",
  "h3",
  "article a",
  "li a",
  ".headline",
  ".article-title",
  ".story-title",
];

// Check if the domain is allowed
chrome.storage.local.get(["allowedDomains"], (result) => {
  const domain = window.location.hostname;
  if (!result.allowedDomains?.includes(domain)) return;

  init(); // only run if allowed
});

let lastScan = 0;

async function init() {
  const cohereKey = await getCohereKey();
  if (!cohereKey) {
    console.warn("[Newster] No Cohere key found");
    return;
  }

  // Run immediately
  scanAndDecorateHeadlines(cohereKey);

  // Also repeat every second to catch React/Dynamic headlines
  setInterval(() => {
    const now = Date.now();
    if (now - lastScan > 1000) {
      scanAndDecorateHeadlines(cohereKey);
      lastScan = now;
    }
  }, 1000);
}

function scanAndDecorateHeadlines(cohereKey) {
  const headlines = findHeadlines();
  console.log(`[Newster] Scanning ${headlines.length} elements`);

  for (const el of headlines) {
    if (el.dataset.newsterDecorated) continue;

    const text = el.innerText?.trim();
    if (!text || text.length < 15) continue;

    el.dataset.newsterDecorated = "true";

    const icon = document.createElement("span");
    icon.textContent = "🛈";
    icon.style.cursor = "pointer";
    icon.style.marginLeft = "6px";
    icon.style.fontSize = "0.75em";
    icon.style.opacity = "0.5";
    icon.title = "Summarize";
    icon.style.display = "none";

    el.addEventListener("mouseenter", () => (icon.style.display = "inline"));
    el.addEventListener("mouseleave", () => (icon.style.display = "none"));
    el.appendChild(icon);

    icon.addEventListener("click", async (event) => {
      event.stopPropagation();
      event.preventDefault();

      if (document.querySelector(".newster-bubble")) return;

      const bubble = document.createElement("div");
      bubble.className = "newster-bubble";
      bubble.textContent = "Summarizing...";
      Object.assign(bubble.style, {
        position: "absolute",
        top: "0px",
        left: "0px",
        background: "#f9f9f9",
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "6px",
        fontSize: "14px",
        fontFamily: "sans-serif",
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        zIndex: "9999",
        maxWidth: "400px",
        minWidth: "200px",
      });

      const closeBtn = document.createElement("span");
      closeBtn.textContent = "×";
      closeBtn.style.cssText = `
        position: absolute;
        top: 4px;
        right: 8px;
        cursor: pointer;
        font-weight: bold;
        color: #999;
      `;
      closeBtn.onclick = () => bubble.remove();
      bubble.appendChild(closeBtn);

      document.body.appendChild(bubble);

      const rect = icon.getBoundingClientRect();
      bubble.style.top = `${window.scrollY + rect.top + 20}px`;
      bubble.style.left = `${window.scrollX + rect.left}px`;

      const headline = el.innerText.trim();
      const link = el.closest("a")?.href;

      try {
        let contentText = "";
        if (link) {
          console.log("[Newster] Fetching content from:", link);
          contentText = await fetchArticleText(link);
        }

        const prompt =
          contentText.length > 250
            ? `This article appeared on a news site. Provide a short summary:\n\n${contentText}`
            : `This headline appeared on a news site. Provide context:\n\n${headline}`;

        const summary = await summarizeWithCohere(prompt, cohereKey);
        bubble.childNodes[0].textContent = summary;
      } catch (err) {
        bubble.childNodes[0].textContent = "Error summarizing.";
        console.warn("[Newster] Summary error:", err);
      }
    });
  }
}

function findHeadlines() {
  const found = [];
  const seen = new Set();

  for (const selector of HEADLINE_SELECTORS) {
    const candidates = document.querySelectorAll(selector);
    candidates.forEach((el) => {
      const text = el.innerText?.trim();
      if (text && text.length > 10 && !seen.has(el)) {
        found.push(el);
        seen.add(el);
      }
    });
  }

  return found;
}

function getCohereKey() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["cohereKey"], (result) => {
      resolve(result.cohereKey);
    });
  });
}

async function summarizeWithCohere(text, key) {
  const response = await fetch("https://api.cohere.ai/v1/summarize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "Cohere-Version": "2022-12-06",
    },
    body: JSON.stringify({
      text: text,
      length: "short",
      format: "paragraph",
      model: "summarize-xlarge",
      additional_command: "Summarize this news headline clearly",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[Newster] API responded with:", errorText);
    throw new Error(`Cohere API error ${response.status}`);
  }

  const data = await response.json();
  return data.summary || "(no summary returned)";
}

function fetchArticleText(url) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: "fetchArticle", url }, (response) => {
      if (response?.success && response.content) {
        const doc = new DOMParser().parseFromString(
          response.content,
          "text/html"
        );
        const paragraphs = Array.from(doc.querySelectorAll("p"));
        const combined = paragraphs.map((p) => p.innerText.trim()).join(" ");
        resolve(combined.slice(0, 3000)); // Trim long content
      } else {
        resolve(""); // Fall back to headline
      }
    });
  });
}
