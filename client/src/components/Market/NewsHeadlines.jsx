import React from 'react';

const NewsHeadlines = ({ headlines }) => {
  if (!headlines || headlines.length === 0) {
    return <p>No headlines available</p>;
  }

  return (
    <div className="news-headlines">
      <h3>Top Market Headlines</h3>
      <ul className="headlines-list">
        {headlines.map((headline, index) => (
          <li key={index} className="headline-item">
            <div className="headline-title">{headline.title}</div>
            <div className="headline-source">{headline.source}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsHeadlines;