import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const MultiSelectContext = createContext(null);

export function MultiSelectProvider({ children }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedCells, setSelectedCells] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const containerRef = useRef(null);

  const toggleEnabled = useCallback(() => {
    setIsEnabled(prev => {
      const newValue = !prev;
      if (!newValue) {
        setSelectedCells([]);
      }
      return newValue;
    });
    setIsDragging(false);
    setDragStart(null);
  }, []);

  const toggleCellSelection = useCallback((cellId, isCtrlPressed = false) => {
    if (isCtrlPressed) {
      setSelectedCells(prev => 
        prev.includes(cellId) 
          ? prev.filter(id => id !== cellId)
          : [...prev, cellId]
      );
    } else if (!selectedCells.includes(cellId)) {
      setSelectedCells(prev => [...prev, cellId]);
    }
  }, [selectedCells]);

  const startDrag = useCallback((cellId, event) => {
    if (!isEnabled) return;
    
    const isCtrlPressed = event.ctrlKey || event.metaKey;
    setIsDragging(true);
    setDragStart(cellId);
    
    // If Ctrl is pressed, toggle selection
    if (isCtrlPressed) {
      toggleCellSelection(cellId, true);
    } else if (!selectedCells.includes(cellId)) {
      // Otherwise, start new selection
      setSelectedCells([cellId]);
    }
  }, [isEnabled, selectedCells, toggleCellSelection]);

  const updateDrag = useCallback((cellId) => {
    if (!isDragging || !dragStart) return;
    
    // Select all cells between dragStart and current
    setSelectedCells(prev => {
      const allCells = Array.from(new Set([...prev, cellId]));
      return allCells;
    });
  }, [isDragging, dragStart]);

  const endDrag = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedCells([]);
  }, []);

  const removeCellSelection = useCallback((cellId) => {
    setSelectedCells(prev => prev.filter(id => id !== cellId));
  }, []);

  const value = {
    isEnabled,
    selectedCells,
    isDragging,
    containerRef,
    toggleEnabled,
    toggleCellSelection,
    startDrag,
    updateDrag,
    endDrag,
    clearSelection,
    removeCellSelection,
    isSelected: (cellId) => selectedCells.includes(cellId),
  };

  return (
    <MultiSelectContext.Provider value={value}>
      {children}
    </MultiSelectContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useMultiSelect() {
  const context = useContext(MultiSelectContext);
  if (!context) {
    throw new Error('useMultiSelect must be used within a MultiSelectProvider');
  }
  return context;
}
