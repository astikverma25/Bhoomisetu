import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext(null);

export const AccessibilityProvider = ({ children }) => {
  const fontSizes = [14, 16, 18];
  const [fontIndex, setFontIndex] = useState(1); // 16px default
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSizes[fontIndex]}px`;
  }, [fontIndex]);

  useEffect(() => {
    if (isHighContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [isHighContrast]);

  const setFontSize = (idx) => {
    if (idx >= 0 && idx < fontSizes.length) {
      setFontIndex(idx);
    }
  };

  const toggleContrast = () => {
    setIsHighContrast(prev => !prev);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        fontIndex,
        setFontSize,
        isHighContrast,
        toggleContrast
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
