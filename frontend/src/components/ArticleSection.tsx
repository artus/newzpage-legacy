import React, { useEffect, useState } from 'react';
import Article from '../domain/Article';
import './ArticleSection.css';

function ArticleSection(props: { article: Article }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState('');

  const { article } = props;
  const {
    link,
    title,
    published,
  } = article;

  useEffect(() => {
    (async () => {
      try {
        const proxiedLink = `http://localhost:8080/api/summary?link=${link}`;
        const response = await fetch(proxiedLink);
        if (!response.ok) {
          throw new Error(`Failed to load summary for "${link}"!`);
        }
        const loadedSummary = await response.json();
        setSummary(loadedSummary.summary);
      } catch (thrownError) {
        setError((thrownError as Error).message);
      }
      setIsLoading(false);
    })();
  }, []);

  const errorOrContent = () => (error
    ? <p>{error}</p>
    : <p className="article-summary">{summary}</p>
  );

  const loadingOrContent = () => (isLoading
    ? <p>Loading...</p>
    : errorOrContent()
  );

  const getRandomArticleClassName = () => {
    const randomInt = Math.floor(Math.random() * 10);
    return `article-type-${randomInt}`;
  };

  return (
    <article className={`${getRandomArticleClassName()}`}>
      <a href={link} className="article-link">
        <h3 className="article-title">{title}</h3>
      </a>
      <p className="article-date">{new Date(published).toLocaleDateString()}</p>
      {loadingOrContent()}
    </article>
  );
}

export default ArticleSection;
