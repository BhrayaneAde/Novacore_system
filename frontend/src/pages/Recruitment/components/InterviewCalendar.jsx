import React from "react";
import { Calendar, Clock, User } from "lucide-react";

const InterviewCalendar = ({ interviews = [] }) => {
  const upcomingInterviews = [
    {
      id: 1,
      candidate: "Alice Dupont",
      date: "2025-10-25",
      time: "10:00",
      interviewer: "Marie Dubois",
      type: "Entretien RH",
    },
    {
      id: 2,
      candidate: "Marc Lambert",
      date: "2025-10-26",
      time: "14:00",
      interviewer: "Sophie Martin",
      type: "Entretien technique",
    },
    {
      id: 3,
      candidate: "Julie Petit",
      date: "2025-10-27",
      time: "11:00",
      interviewer: "Thomas Dubois",
      type: "Entretien final",
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Entretiens à venir</h3>
      
      <div className="space-y-4">
        {upcomingInterviews.map((interview) => (
          <div
            key={interview.id}
            className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 bg-blue-50 text-secondary-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                {interview.candidate}
              </h4>
              <p className="text-sm text-gray-600 mb-2">{interview.type}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(interview.date).toLocaleDateString("fr-FR")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{interview.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{interview.interviewer}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewCalendar;
