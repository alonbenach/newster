# 🗞️ Newster — Rewrite the News

**Newster** is a Chrome/Edge browser extension that transforms clickbait headlines into informative, concise summaries using Cohere’s AI.  
Hover over any headline to reveal a small ℹ️ icon — click it to get a short, contextual summary of the article.

***Ideal for readers who want signal, not noise.***

---

## What It Does

- ✅ Detects headlines on popular news sites
- ✅ Fetches linked article content (if accessible)
- ✅ Sends that content (or the headline alone, as fallback) to Cohere’s summarization API
- ✅ Shows a floating summary bubble with a close button
- ✅ Only activates on domains **you approve**
- ✅ Keeps all API keys stored locally in your browser — nothing is tracked or sent elsewhere

---

## How to Use

1. Install the extension (see below)
2. Visit a news website (e.g. BBC, CNN, etc.)
3. Click the Newster icon in your browser
4. Click “Allow summaries for this domain”
5. Hover over a headline → click the ℹ️ icon → see a summary

---

## API Setup (1-time only)

Newster uses Cohere’s summarization API. To use it, you’ll need a free API key:

1. Get a key from [cohere.com/api-keys](https://dashboard.cohere.com/api-keys)
2. Open Newster's **extension options**
3. Paste your key into the input and save

> You only need to do this once. The key is saved locally in your browser.

---

## Download

You can download the latest release directly here:  
👉 [Newster Extension (.zip)](https://github.com/alonbenach/newster/releases/latest)

Then follow the instructions below to install manually.

---

## Local Installation

You can install Newster manually by loading it as an unpacked extension:

1. Clone this repo or download the `.zip`:
   ```bash
   git clone https://github.com/alonbenach/newster.git

    or download and extract newster.zip

2. Open Chrome and go to: chrome://extensions/

3. Enable Developer Mode (top right)

4. Click Load Unpacked and select the folder

5. You’re done!

❗Note: This extension is for personal, educational, or portfolio use only.

---

## Legal & Ethics

Newster does not bypass paywalls or unlock subscriber-only content.
It attempts to summarize the first visible parts of a news article or headline for convenience.
We recommend using it with publicly available content only.

---

## Tech Stack

* Manifest V3 Chrome extension
* Vanilla JS
* Cohere summarization API
* DOM injection + background service worker

---

## Contributing
If you have improvements or want to adapt Newster for a specific site — feel free to fork and submit a pull request!



#### Created by: Alon Benach