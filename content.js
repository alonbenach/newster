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

(async function init() {
  const cohereKey = await getCohereKey();
  if (!cohereKey) {
    console.warn("[Newster] No Cohere key found");
    return;
  }

  const headlines = findHeadlines();
  console.log(`[Newster] Found ${headlines.length} potential headlines`);

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

      if (el.querySelector(".newster-summary")) return;

      const summaryBox = document.createElement("div");
      summaryBox.className = "newster-summary";
      summaryBox.textContent = "Summarizing...";
      summaryBox.style.fontSize = "0.85em";
      summaryBox.style.marginTop = "6px";
      summaryBox.style.background = "#f4f4f4";
      summaryBox.style.border = "1px solid #ccc";
      summaryBox.style.padding = "6px";
      summaryBox.style.borderRadius = "4px";
      summaryBox.style.maxWidth = "500px";
      el.appendChild(summaryBox);

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
        summaryBox.textContent = summary;
        console.log("[Newster] Summary:", summary);
      } catch (err) {
        summaryBox.textContent = "Error summarizing.";
        console.warn("[Newster] Summary error:", err);
      }
    });
  }
})();

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
