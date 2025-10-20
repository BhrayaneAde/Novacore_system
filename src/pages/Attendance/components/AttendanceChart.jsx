import React from "react";

const AttendanceChart = ({ data = [] }) => {
  const maxValue = 100;

  const chartData = [
    { label: "Lun", value: 95 },
    { label: "Mar", value: 98 },
    { label: "Mer", value: 92 },
    { label: "Jeu", value: 97 },
    { label: "Ven", value: 94 },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Taux de présence hebdomadaire</h3>
      <div className="flex items-end justify-between gap-4 h-64">
        {chartData.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: "100%" }}>
              <div
                className="absolute bottom-0 w-full bg-blue-500 rounded-t-lg transition-all"
                style={{ height: `${item.value}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-600">{item.label}</span>
            <span className="text-xs text-gray-500">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceChart;
