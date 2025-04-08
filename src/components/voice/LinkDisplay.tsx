
import React from 'react';

interface LinkDisplayProps {
  text: string;
}

const LinkDisplay: React.FC<LinkDisplayProps> = ({ text }) => {
  // Function to detect URLs in text and wrap them in anchor tags
  const linkifyText = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    const result = [];
    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        // This is regular text
        result.push(<span key={`text-${i}`}>{parts[i]}</span>);
      } else {
        // This is a URL
        result.push(
          <a 
            key={`link-${i}`} 
            href={parts[i]} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 underline hover:text-blue-600"
          >
            {parts[i]}
          </a>
        );
      }
    }
    
    return result;
  };

  return <div className="whitespace-pre-wrap">{linkifyText(text)}</div>;
};

export default LinkDisplay;
