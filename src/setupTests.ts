import '@testing-library/jest-dom';
import * as React from 'react';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => React.createElement('div', props, children),
  },
}));

// Mock the cn utility function
jest.mock('@/lib/utils', () => ({
  cn: (...classes: (string | undefined)[]) => 
    classes.filter(Boolean).join(' '),
}));