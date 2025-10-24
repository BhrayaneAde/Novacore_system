import React from "react";

const CalendarView = ({ events = [] }) => {
  const daysInMonth = 31;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="grid grid-cols-7 gap-2">
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}
        {days.map((day) => (
          <div
            key={day}
            className="aspect-square border border-gray-200 rounded-lg p-2 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <span className="text-sm font-medium text-gray-900">{day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
