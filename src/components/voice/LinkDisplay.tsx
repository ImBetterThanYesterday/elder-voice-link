
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LinkDisplayProps {
  text: string;
}

const LinkDisplay: React.FC<LinkDisplayProps> = ({ text }) => {
  // Function to detect URLs in text and wrap them in anchor tags
  const linkifyText = (text: string) => {
    // Improved regex that handles URLs with parentheses
    // This regex looks for URLs starting with http or https and captures them properly
    const urlRegex = /(https?:\/\/[^\s)]+)/g;
    
    // Check for Uber ride links specifically
    const uberLinkMatch = text.match(/https?:\/\/m\.uber\.com\/go\/[^\s)]+/);
    const uberLink = uberLinkMatch ? uberLinkMatch[0] : null;
    
    // If we have an Uber link, extract it and create a special UI for it
    if (uberLink) {
      // Replace the URL in the text with a placeholder so we can render the regular text
      const textWithoutUberLink = text.replace(uberLink, '');
      
      // Process the regular text with any other links
      const parts = textWithoutUberLink.split(urlRegex);
      const regularTextElements = [];
      
      for (let i = 0; i < parts.length; i++) {
        if (parts[i] && parts[i].trim()) { // Skip empty parts
          if (i % 2 === 0) {
            // This is regular text
            regularTextElements.push(<span key={`text-${i}`}>{parts[i]}</span>);
          } else {
            // This is a URL (but not the Uber link)
            regularTextElements.push(
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
      }
      
      // Return the regular text followed by the Uber ride button
      return (
        <div className="flex flex-col space-y-4">
          <div className="whitespace-pre-wrap">{regularTextElements}</div>
          <div className="flex justify-center mt-2">
            <Button 
              variant="outline" 
              className="bg-black text-white border-blue-500 hover:bg-blue-900 transition-colors flex items-center space-x-2 px-6 py-3"
              onClick={() => window.open(uberLink, '_blank', 'noopener,noreferrer')}
            >
              <span>Take your ride</span>
              <ExternalLink size={16} />
            </Button>
          </div>
        </div>
      );
    }
    
    // Regular case without Uber link - process all URLs in the text
    const parts = text.split(urlRegex);
    const result = [];
    
    for (let i = 0; i < parts.length; i++) {
      if (parts[i] && parts[i].trim()) { // Skip empty parts
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
    }
    
    return result;
  };

  return <div className="whitespace-pre-wrap">{linkifyText(text)}</div>;
};

export default LinkDisplay;
