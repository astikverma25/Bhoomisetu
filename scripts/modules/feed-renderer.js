/**
 * Feed Renderer
 * Dynamically renders What's New circulars, Facebook updates, and Twitter updates.
 */
export class FeedRenderer {
  constructor(containerSelectors = {}) {
    this.whatsNewContainer = document.querySelector(containerSelectors.whatsNew || '#whatsNewList');
    this.fbContainer = document.querySelector(containerSelectors.facebook || '#fbPostContainer');
    this.twitterContainer = document.querySelector(containerSelectors.twitter || '#twitterFeedList');
  }

  render(updatesData) {
    if (!updatesData) return;

    // Render What's New
    if (this.whatsNewContainer && updatesData.whatsNew) {
      this.whatsNewContainer.innerHTML = updatesData.whatsNew.items.map(item => `
        <div class="news-item">
          <div class="news-meta">
            <span class="news-date">${item.date}</span>
            <span class="news-badge">${item.badge}</span>
          </div>
          <a href="${item.link}">
            <p class="news-text">${item.text}</p>
          </a>
        </div>
      `).join('');
    }

    // Render Twitter
    if (this.twitterContainer && updatesData.twitter) {
      this.twitterContainer.innerHTML = updatesData.twitter.items.map(tweet => `
        <div class="tweet-item">
          <div class="tweet-header">
            <span class="tweet-user">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              ${tweet.handle}
            </span>
            <span class="tweet-time">${tweet.time}</span>
          </div>
          <p class="tweet-body">${tweet.text}</p>
        </div>
      `).join('');
    }
  }
}
