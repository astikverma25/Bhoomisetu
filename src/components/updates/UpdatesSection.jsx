import React from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';

export const UpdatesSection = () => {
  const { content } = useLanguage();
  const { whatsNew, facebook, twitter } = content.updates;

  return (
    <section className="updates-section" id="updates">
      <div className="container">
        <div className="updates-grid">
          {/* Column 1: What's New */}
          <div className="feed-card">
            <div className="feed-header">
              <h3 className="feed-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#ea580c">
                  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
                </svg>
                {whatsNew.title}
              </h3>
            </div>
            <div className="feed-scroll-body">
              {whatsNew.items.map((item, idx) => (
                <div key={idx} className="news-item">
                  <div className="news-meta">
                    <span className="news-date">{item.date}</span>
                    <span className="news-badge">{item.badge}</span>
                  </div>
                  <a href={item.link}>
                    <p className="news-text">{item.text}</p>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Facebook */}
          <div className="feed-card">
            <div className="feed-header">
              <h3 className="feed-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877f2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                {facebook.title}
              </h3>
            </div>
            <div className="feed-scroll-body">
              <div className="fb-profile-strip">
                <div className="fb-avatar">BS</div>
                <div className="fb-info">
                  <h5>{facebook.pageName}</h5>
                  <span>{facebook.followers} • {facebook.postDate}</span>
                </div>
              </div>
              <p className="fb-post-text">{facebook.postText}</p>
              <div className="fb-post-media">
                <img src={facebook.postImage} alt="Ministry Facebook update photo" />
              </div>
              <div className="fb-post-actions">
                <span>👍 1.4K Likes</span>
                <span>💬 184 Comments</span>
                <span>🔄 320 Shares</span>
              </div>
            </div>
          </div>

          {/* Column 3: Twitter */}
          <div className="feed-card">
            <div className="feed-header">
              <h3 className="feed-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#0f172a">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                {twitter.title}
              </h3>
            </div>
            <div className="feed-scroll-body">
              {twitter.items.map((tweet, idx) => (
                <div key={idx} className="tweet-item">
                  <div className="tweet-header">
                    <span className="tweet-user">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      {tweet.handle}
                    </span>
                    <span className="tweet-time">{tweet.time}</span>
                  </div>
                  <p className="tweet-body">{tweet.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
