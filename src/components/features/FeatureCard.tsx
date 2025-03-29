
import { ReactNode } from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
}

export const FeatureCard = ({ title, description, icon }: FeatureCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-2 border-elder-gray hover:border-elder-primary transition-colors">
      <div className="flex flex-col items-center text-center">
        <div className="text-elder-primary mb-4 text-4xl">
          {icon}
        </div>
        <h3 className="text-elder-xl font-bold text-elder-dark mb-3">{title}</h3>
        <p className="text-elder-lg text-elder-text">{description}</p>
      </div>
    </div>
  );
};
