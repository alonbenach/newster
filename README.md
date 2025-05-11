# 🗞️ Newster — Rewrite the News

**Newster** is a Chrome/Edge browser extension that transforms clickbait headlines into informative, concise summaries using Cohere’s AI.  
Hover over any headline to reveal a small ℹ️ icon — click it to get a short, contextual summary of the article.

> Ideal for readers who want signal, not noise.

---

## What It Does

- ✅ Detects headlines on popular news sites
- ✅ Attempts to fetch the linked article’s content
- ✅ Sends that content (or the headline alone, as fallback) to Cohere’s summarization API
- ✅ Shows a floating summary bubble with a close button
- ✅ Keeps all API keys stored locally in your browser — nothing is tracked or sent elsewhere

---

## How to Use

1. **Install the extension (see below)**
2. Go to any news website (e.g. CNN, BBC, Fox, etc.)
3. Hover over a headline → you’ll see a small ℹ️ icon appear
4. Click the icon → get a summary bubble powered by Cohere

---

## Setup

Newster uses Cohere’s free summarization API.  
You’ll need your own API key (takes 30 seconds).

1. Go to [Cohere API Console](https://dashboard.cohere.com/api-keys)
2. Copy your free API key
3. Click the Newster icon in your browser
4. Paste the key and click **Save Key**
5. You’re ready to go!

---

## 🧪 Local Installation

You can install Newster manually by loading it as an unpacked extension:

1. Clone this repo or download the `.zip`:
   ```bash
   git clone https://github.com/yourusername/newster.git

    or download and extract newster.zip

2. Open Chrome and go to: chrome://extensions/

3. Enable Developer Mode (top right)

4. Click Load Unpacked and select the folder

5. You’re done!

❗Note: This extension is for personal, educational, or portfolio use only.

## Legal & Ethics

Newster does not bypass paywalls or unlock subscriber-only content.
It attempts to summarize the first visible parts of a news article or headline for convenience.
We recommend using it with publicly available content only.

## Tech Stack

* Manifest V3 Chrome extension
* Vanilla JS
* Cohere summarization API
* DOM injection + background service worker

## Contributing
If you have improvements or want to adapt Newster for a specific site — feel free to fork and submit a pull request!

## Created by Alon Benach