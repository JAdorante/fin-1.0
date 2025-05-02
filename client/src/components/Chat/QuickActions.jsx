import React from 'react';

const QuickActions = ({ onActionClick }) => {
  const actions = [
    { id: 'upload', label: 'Upload Portfolio', action: 'Upload Portfolio' },
    { id: 'market', label: 'Market Update', action: 'Show market summary' },
    { id: 'strategy', label: 'Suggest Strategy', action: 'Suggest a strategy for my portfolio' },
  ];

  return (
    <div className="quick-actions">
      {actions.map((action) => (
        <button
          key={action.id}
          className="action-button"
          onClick={() => onActionClick(action.action)}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
};

export default QuickActions;