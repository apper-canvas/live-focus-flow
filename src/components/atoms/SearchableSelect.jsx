import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';

const SearchableSelect = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = "Select option...", 
  searchPlaceholder = "Search options...",
  className,
  disabled = false,
  renderOption = null,
  renderValue = null
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Filter options based on search term
  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected option
  const selectedOption = options.find(opt => opt.value === value);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
          handleOptionSelect(filteredOptions[focusedIndex]);
        }
        break;
    }
  };

  const handleOptionSelect = (option) => {
    onChange?.(option.value);
    setIsOpen(false);
    setSearchTerm('');
    setFocusedIndex(-1);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={cn(
          "w-full flex items-center justify-between gap-2 px-3 py-2",
          "bg-white border border-gray-300 rounded-lg",
          "text-sm text-gray-900 hover:border-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
          "transition-colors duration-200",
          disabled && "bg-gray-50 text-gray-400 cursor-not-allowed",
          isOpen && "border-primary ring-2 ring-primary ring-opacity-20"
        )}
      >
        <span className="flex items-center gap-2 flex-1 text-left">
          {selectedOption ? (
            renderValue ? renderValue(selectedOption) : (
              <>
                {selectedOption.icon && (
                  <ApperIcon name={selectedOption.icon} className="h-4 w-4" />
                )}
                <span>{selectedOption.label}</span>
                {selectedOption.count !== undefined && (
                  <span className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded-full">
                    {selectedOption.count}
                  </span>
                )}
              </>
            )
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </span>
        <ApperIcon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          className="h-4 w-4 text-gray-400" 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <ApperIcon 
                name="Search" 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" 
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <button
                  key={option.value}
                  onClick={() => handleOptionSelect(option)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 text-left text-sm",
                    "hover:bg-gray-50 transition-colors duration-150",
                    value === option.value && "bg-primary bg-opacity-10 text-primary",
                    focusedIndex === index && "bg-gray-50"
                  )}
                >
                  {renderOption ? renderOption(option) : (
                    <>
                      {option.icon && (
                        <ApperIcon name={option.icon} className="h-4 w-4" />
                      )}
                      <span className="flex-1">{option.label}</span>
                      {option.count !== undefined && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                          {option.count}
                        </span>
                      )}
                    </>
                  )}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;