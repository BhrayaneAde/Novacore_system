import React from "react";
import { useNavigate } from "react-router-dom";
import Badge from "../../../components/ui/Badge";
import { Award, TrendingUp } from "lucide-react";

const ReviewCard = ({ review }) => {
  const navigate = useNavigate();

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div
      onClick={() => navigate(`/app/performance/reviews/${review.id}`)}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{review.employeeName}</h3>
            <p className="text-sm text-gray-600">{review.period}</p>
          </div>
        </div>
        {renderStars(review.rating)}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Objectifs complétés</span>
          <span className="font-medium text-gray-900">
            {review.goals.filter(g => g.status === "completed").length}/{review.goals.length}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <span>Évalué le {new Date(review.reviewDate).toLocaleDateString("fr-FR")}</span>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
