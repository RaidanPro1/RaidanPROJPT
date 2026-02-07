
import React from 'react';
import PredictiveHub from './PredictiveHub';

/**
 * PredictiveCenter now serves as the high-level Insight Matrix entry point.
 * All indicators are centralized in the redesigned PredictiveHub component.
 */
const PredictiveCenter: React.FC = () => {
  return <PredictiveHub />;
};

export default PredictiveCenter;
