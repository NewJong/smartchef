import React, { useState } from 'react';
import { Calendar } from 'react-native-calendars';

interface DateRange {
  startDate: string | null;
  endDate: string | null;
}

interface DateRangeCalendarProps {
  onChange: (range: DateRange, marked: { [key: string]: any }) => void;
}

const DateRangeCalendar: React.FC<DateRangeCalendarProps> = ({ onChange }) => {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });
  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});

  const getDateRange = (start: string, end: string): string[] => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const range: string[] = [];
    let current = new Date(startDate);

    while (current <= endDate) {
      range.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }

    return range;
  };

  const onDayPress = (day: { dateString: string }) => {
    const { startDate, endDate } = dateRange;

    if (!startDate || (startDate && endDate)) {
      const newStart = day.dateString;
      setDateRange({ startDate: newStart, endDate: null });
      const newMarked = {
        [newStart]: {
          startingDay: true,
          color: '#70B9BE',
          textColor: 'white',
        },
      };
      setMarkedDates(newMarked);
      onChange({ startDate: newStart, endDate: null }, newMarked);
    } else {
      const range = getDateRange(startDate, day.dateString);
      const newMarked: { [key: string]: any } = {};

      range.forEach((date, index) => {
        newMarked[date] = {
          color: '#70B9BE',
          textColor: 'white',
          startingDay: index === 0,
          endingDay: index === range.length - 1,
        };
      });

      setMarkedDates(newMarked);
      setDateRange({ startDate, endDate: day.dateString });
      onChange({ startDate, endDate: day.dateString }, newMarked);
    }
  };

  return (
    <Calendar
      markingType="period"
      markedDates={markedDates}
      onDayPress={onDayPress}
      theme={{
        textDayFontSize: 16,
        textMonthFontSize: 16,
        textDayHeaderFontSize: 12,
        arrowColor: '#0A2533',
        todayTextColor: '#70B9BE',
      }}
      style={{
        transform: [{ scale: 0.95 }],
        backgroungColor: '#0A2533',
        marginBottom: 12,
        borderRadius: 20,
        padding: 0,
        height: 320,
        weight: 200,
      }}
    />
  );
};

export default DateRangeCalendar;
