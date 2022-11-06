import React, {
  ReactNode, useEffect, useMemo, useState,
} from 'react';
import debounce from 'debounce';
import Article from '../domain/Article';
import Feed from '../domain/Feed';
import ArticleSection from './ArticleSection';
import './FeedSection.css';

interface FeedProps {
  feed: Feed
}

function FeedSection({
  feed,
}: FeedProps) {
  const getWidth = () => Math.floor(
    window.innerWidth / parseFloat(getComputedStyle(document.documentElement).fontSize),
  );

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [articles, setArticles] = useState<Array<Article>>([]);
  const [resizer, setResizer] = useState({
    isResized: true,
    width: getWidth(),
  });
  const [columns, setColumns] = useState(1);

  const updateIsResized = useMemo(() => debounce(() => {
    if (resizer.width !== getWidth()) {
      console.log(`Resized: ${resizer.width} - ${getWidth()}`);
      setResizer({
        isResized: true,
        width: getWidth(),
      });
    }
  }, 200), []);

  window.addEventListener('resize', updateIsResized);

  useEffect(() => {
    console.log(`Inside useEffect: ${resizer.isResized} - ${!isLoading} - ${!errorMessage}`);
    if (resizer.isResized && !isLoading && !errorMessage) {
      console.log('settings columns');

      let targetColumns = 1;

      if (resizer.width < 40) {
        targetColumns = 1;
        console.log('1 column');
      } else if (resizer.width < 70) {
        targetColumns = 2;
        console.log('2 columns');
      } else if (resizer.width < 100) {
        targetColumns = 3;
        console.log('3 columns');
      } else {
        targetColumns = 4;
        console.log('4 columns');
      }

      if (columns !== targetColumns) {
        setColumns(targetColumns);
      }
      setResizer({ isResized: false, width: resizer.width });
    }
  }, [resizer, isLoading, errorMessage]);

  useEffect(() => {
    (async () => {
      try {
        setTitle(await feed.getTitle());
        setLink(await feed.getLink());
        setArticles(await feed.getArticles());
      } catch (error) {
        setErrorMessage((error as Error).message);
      }
      setIsLoading(false);
    })();
  }, []);

  const articleColumns = useMemo(() => {
    const cols: Article[][] = [];
    for (let i = 0; i < columns; i += 1) {
      cols.push([]);
    }

    let count = 0;
    for (let i = 0; i < articles.length; i += 1) {
      cols[count].push(articles[i]);
      if (count === columns - 1) {
        count = 0;
      } else {
        count += 1;
      }
    }

    return cols.map((col, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <div key={index} className="article-column">
        {col.map((article) => <ArticleSection key={article.link} article={article} />)}
      </div>
    ));
  }, [columns]);

  const errorOrContent: () => ReactNode = () => (errorMessage
    ? <p>{errorMessage}</p>
    : (
      <>
        <a className="feed-section-header-title" href={link}><h2>{title}</h2></a>
        <div className="feed-section-articles">
          {articleColumns}
        </div>
      </>
    ));

  const loadingOrContent: () => ReactNode = () => (isLoading
    ? <p>Loading</p>
    : errorOrContent());

  return (
    <section className="feed-section">
      {loadingOrContent()}
    </section>
  );
}

export default FeedSection;
