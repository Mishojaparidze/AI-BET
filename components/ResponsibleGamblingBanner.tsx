import React from 'react';

export const ResponsibleGamblingBanner: React.FC = () => {
  return (
    <footer className="bg-brand-bg-dark border-t border-brand-border mt-12 py-4">
      <div className="container mx-auto px-4 text-center text-xs text-brand-text-secondary">
        <p>
          Please gamble responsibly. For help, visit BeGambleAware.org. You must be 18 or over to use this site.
        </p>
        <p className="mt-1">
          BetGenius AI is a simulation tool and does not offer real-money gambling. All data is for entertainment purposes.
        </p>
      </div>
    </footer>
  );
};
