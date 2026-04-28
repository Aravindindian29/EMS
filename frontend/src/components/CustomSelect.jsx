import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';

const CustomSelect = ({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select an option",
  className = "",
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  const selectedOption = options.find(option => option.value === value);

  // Helper function to calculate dropdown height based on options
  const calculateDropdownHeight = useCallback(() => {
    const optionHeight = 48; // Approximate height per option (px-4 py-3 = 48px)
    const maxDropdownHeight = 240; // max-h-60 in pixels
    const actualHeight = Math.min(options.length * optionHeight, maxDropdownHeight);
    return actualHeight;
  }, [options.length]);

  const updateDropdownPosition = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const dropdownHeight = calculateDropdownHeight();
      
      // Calculate available space
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      // Determine optimal direction with boundary checks
      let topPosition;
      if (spaceBelow >= dropdownHeight) {
        // Enough space below, open downward
        topPosition = rect.bottom;
      } else if (spaceAbove >= dropdownHeight && spaceAbove > spaceBelow) {
        // More space above and enough to fit, open upward
        topPosition = rect.top - dropdownHeight;
      } else {
        // Not enough space in either direction, choose the one with more space
        // and clamp to viewport bounds
        if (spaceBelow > spaceAbove) {
          topPosition = rect.bottom;
        } else {
          topPosition = Math.max(0, rect.top - dropdownHeight);
        }
      }
      
      setDropdownPosition({
        top: topPosition,
        left: rect.left,
        width: rect.width
      });
    }
  }, [calculateDropdownHeight]);

  const handleToggle = useCallback(() => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setHighlightedIndex(-1);
      if (!isOpen) {
        setTimeout(() => {
          updateDropdownPosition();
        }, 0);
      }
    }
  }, [isOpen, disabled, updateDropdownPosition]);

  const handleSelect = useCallback((option) => {
    onChange(option.value);
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, [onChange]);

  const handleKeyDown = useCallback((e) => {
    if (!isOpen || disabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < options.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : options.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSelect(options[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        triggerRef.current?.focus();
        break;
    }
  }, [isOpen, highlightedIndex, options, disabled, handleSelect]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target) &&
          dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        // Throttle scroll events to prevent excessive re-renders
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
          updateDropdownPosition();
        }, 16); // ~60fps throttling
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('scroll', handleScroll, true);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScroll, true);
      document.removeEventListener('keydown', handleKeyDown);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isOpen, handleKeyDown, updateDropdownPosition]);

  return (
    <div className={`custom-select ${className}`} ref={dropdownRef}>
      {/* Custom Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`
          w-full px-4 py-3 bg-ironman-dark/60 border border-ironman-red/30 
          rounded-lg text-left flex items-center justify-between space-x-2
          transition-all duration-300 backdrop-blur-sm
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isOpen ? 'border-ironman-gold shadow-glossy ring-2 ring-ironman-gold/30' : 'hover:border-ironman-red/50 hover:shadow-glossy'}
        `}
      >
        <span className={`text-white ${!selectedOption ? 'text-gray-400' : ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={`w-5 h-5 text-ironman-gold transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Portal-rendered Dropdown Menu */}
      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          className="fixed z-[99999] bg-ironman-dark/95 border border-ironman-red/30 rounded-xl shadow-glossy-lg backdrop-blur-xl overflow-hidden"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`
          }}
        >
          <div 
            className="max-h-60 overflow-y-auto" 
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              overflow: '-moz-scrollbars-none'
            }}
          >
            {options.length > 0 ? (
              options.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`
                    w-full px-4 py-3 text-left transition-all duration-200
                    ${index === highlightedIndex 
                      ? 'bg-gradient-to-r from-ironman-gold/20 to-ironman-gold/10 border-l-4 border-ironman-gold' 
                      : 'hover:bg-ironman-red/10'
                    }
                    ${option.value === value 
                      ? 'bg-yellow-400 text-black font-semibold hover:text-white' 
                      : 'text-white'
                    }
                  `}
                >
                  <span>{option.label}</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-400">
                No options available
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default CustomSelect;
