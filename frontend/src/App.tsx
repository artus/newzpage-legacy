import React, { useState } from 'react';
import FeedSection from './components/FeedSection';
import Footer from './components/Footer';
import Header from './components/header/Header';
import Feed from './domain/Feed';

function App() {
  const [api] = useState('http://localhost:8080');

  const rssFeeds = [
    new Feed('https://news.ycombinator.com/rss', api),
    new Feed('https://www.reddit.com/.rss', api),
    new Feed('https://www.lksjdfmlsjfmlsjdmlfjsdlfjd.com/.rss', api),
  ];

  return (
    <>
      <Header />
      { rssFeeds.map((rssFeed) => <FeedSection key={rssFeed.link} feed={rssFeed} />)}
      <Footer />
    </>
  );
}

export default App;
