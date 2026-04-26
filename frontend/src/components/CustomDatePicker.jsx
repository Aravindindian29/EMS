import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

function CustomCalendar({
  selectedDate,
  onDateSelect,
  isOpen,
  onClose,
  inputRef,
  maxDate = new Date(),
  position = { top: 0, left: 0 }
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectionMode, setSelectionMode] = useState('calendar');
  const [yearRange, setYearRange] = useState(Math.floor(new Date().getFullYear() / 10) * 10);
  const calendarRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, inputRef]);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateKey = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const isToday = (day, month, year) => {
    const today = new Date();
    return day === today.getDate() &&
           month === today.getMonth() &&
           year === today.getFullYear();
  };

  const isSelected = (day, month, year) => {
    if (!selectedDate) return false;
    const date = new Date(year, month, day);
    return formatDateKey(date) === formatDateKey(selectedDate);
  };

  const isDisabled = (day, month, year) => {
    const date = new Date(year, month, day);
    return date > maxDate;
  };

  const handleDateClick = (day, month, year) => {
    const date = new Date(year, month, day);
    if (!isDisabled(day, month, year)) {
      onDateSelect(date);
    }
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const disabled = isDisabled(day, currentMonth.getMonth(), currentMonth.getFullYear());
      const selected = isSelected(day, currentMonth.getMonth(), currentMonth.getFullYear());
      const today = isToday(day, currentMonth.getMonth(), currentMonth.getFullYear());

      days.push(
        <button
          key={day}
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleDateClick(day, currentMonth.getMonth(), currentMonth.getFullYear());
          }}
          disabled={disabled}
          className={`
            p-2 rounded-lg text-sm font-medium transition-all duration-200
            ${disabled
              ? 'text-gray-500 cursor-not-allowed opacity-50'
              : 'text-white hover:bg-ironman-gold/20 cursor-pointer'
            }
            ${selected
              ? 'bg-gradient-to-r from-ironman-red to-ironman-darkRed text-white shadow-glossy'
              : today
                ? 'bg-ironman-gold/20 text-ironman-gold border border-ironman-gold/30'
                : ''
            }
            ${!disabled && !selected && !today ? 'hover:scale-105' : ''}
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  if (!isOpen) return null;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div
      ref={calendarRef}
      className="calendar-popup glossy-card p-4 min-w-[320px] shadow-glossy-lg"
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 9999
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigateMonth('prev');
          }}
          className="p-2 hover:bg-ironman-red/20 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4 text-ironman-gold" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSelectionMode(selectionMode === 'month' ? 'calendar' : 'month');
          }}
          className="text-lg font-semibold text-ironman-gold hover:bg-ironman-gold/20 px-3 py-1 rounded-lg transition-colors cursor-pointer"
          aria-label="Select month"
        >
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigateMonth('next');
          }}
          className="p-2 hover:bg-ironman-red/20 rounded-lg transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4 text-ironman-gold" />
        </button>
      </div>

      {selectionMode === 'month' && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setYearRange(yearRange - 10);
              }}
              className="p-2 hover:bg-ironman-red/20 rounded-lg transition-colors"
              aria-label="Previous decade"
            >
              <ChevronLeft className="w-4 h-4 text-ironman-gold" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectionMode('year');
              }}
              className="text-lg font-semibold text-ironman-gold hover:bg-ironman-gold/20 px-3 py-1 rounded-lg transition-colors"
            >
              {yearRange} - {yearRange + 9}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setYearRange(yearRange + 10);
              }}
              className="p-2 hover:bg-ironman-red/20 rounded-lg transition-colors"
              aria-label="Next decade"
            >
              <ChevronRight className="w-4 h-4 text-ironman-gold" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {monthNames.map((month, index) => (
              <button
                key={month}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentMonth(new Date(currentMonth.getFullYear(), index, 1));
                  setSelectionMode('calendar');
                }}
                className={`p-3 rounded-lg transition-all duration-200 ${
                  index === currentMonth.getMonth()
                    ? 'bg-gradient-to-r from-ironman-red to-ironman-darkRed text-white shadow-glossy'
                    : 'bg-ironman-dark/50 text-white hover:bg-ironman-gold/20'
                }`}
              >
                {month.substring(0, 3)}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectionMode === 'year' && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setYearRange(yearRange - 10);
              }}
              className="p-2 hover:bg-ironman-red/20 rounded-lg transition-colors"
              aria-label="Previous decade"
            >
              <ChevronLeft className="w-4 h-4 text-ironman-gold" />
            </button>
            <span className="text-lg font-semibold text-ironman-gold">
              {yearRange} - {yearRange + 9}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setYearRange(yearRange + 10);
              }}
              className="p-2 hover:bg-ironman-red/20 rounded-lg transition-colors"
              aria-label="Next decade"
            >
              <ChevronRight className="w-4 h-4 text-ironman-gold" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 10 }, (_, i) => yearRange + i).map(year => (
              <button
                key={year}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
                  setSelectionMode('month');
                }}
                className={`p-3 rounded-lg transition-all duration-200 ${
                  year === currentMonth.getFullYear()
                    ? 'bg-gradient-to-r from-ironman-red to-ironman-darkRed text-white shadow-glossy'
                    : 'bg-ironman-dark/50 text-white hover:bg-ironman-gold/20'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectionMode === 'calendar' && (
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs font-semibold text-ironman-gold/70 p-2">
              {day}
            </div>
          ))}
        </div>
      )}

      {selectionMode === 'calendar' && (
        <div className="grid grid-cols-7 gap-1">
          {generateCalendarDays()}
        </div>
      )}
    </div>
  );
}

function CustomDatePicker({ 
  value, 
  onChange, 
  placeholder = "Select date", 
  className = "",
  disabled = false,
  maxDate = new Date() // For DOJ, restrict to past dates
}) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const inputRef = useRef(null);
  const [calendarPosition, setCalendarPosition] = useState({ top: 0, left: 0 });

  // Format date for display
  const formatDateForDisplay = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    // Format date as YYYY-MM-DD in local timezone to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    onChange(formattedDate);
    setIsCalendarOpen(false);
  };

  
  // Toggle calendar and calculate position
  const toggleCalendar = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    if (!disabled && inputRef.current) {
      if (!isCalendarOpen) {
        // Calculate position relative to viewport for portal rendering
        const inputRect = inputRef.current.getBoundingClientRect();
        
        // Position calendar 8px below the input field, using viewport coordinates
        const top = inputRect.bottom + 8; // Viewport Y coordinate
        const left = inputRect.left; // Viewport X coordinate
        
        // Set position immediately
        setCalendarPosition({ top, left });
        
        // Open calendar after position is set
        setIsCalendarOpen(true);
      } else {
        setIsCalendarOpen(false);
      }
    }
  };

  // Handle input field click separately
  const handleInputClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleCalendar(event);
  };

  // Handle icon click separately
  const handleIconClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleCalendar(event);
  };

  // Close calendar
  const closeCalendar = () => {
    setIsCalendarOpen(false);
  };

  // Close calendar on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeCalendar();
      }
    };

    if (isCalendarOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isCalendarOpen]);

  return (
    <div className="relative">
      {/* Date Display Button */}
      <div className="relative">
        <button
          ref={inputRef}
          type="button"
          onClick={handleInputClick}
          disabled={disabled}
          className={`input-glossy w-full pr-12 text-left cursor-pointer ${disabled ? 'cursor-not-allowed opacity-60' : ''} ${className}`}
          aria-label="Select date"
        >
          <span className={value ? 'text-white' : 'text-gray-400'}>
            {formatDateForDisplay(value) || placeholder}
          </span>
        </button>
        
        {/* Calendar Icon */}
        <button
          type="button"
          onClick={handleIconClick}
          disabled={disabled}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-ironman-gold/20 transition-colors ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
          aria-label="Open calendar"
        >
          <Calendar className="w-4 h-4 text-ironman-gold" />
        </button>
      </div>

      {/* Calendar Container - Render using portal to avoid overflow issues */}
      {isCalendarOpen && createPortal(
        <CustomCalendar
          selectedDate={value ? new Date(value) : null}
          onDateSelect={handleDateSelect}
          isOpen={isCalendarOpen}
          onClose={closeCalendar}
          inputRef={inputRef}
          maxDate={maxDate}
          position={calendarPosition}
        />,
        document.body
      )}
    </div>
  );
}

export default CustomDatePicker;
