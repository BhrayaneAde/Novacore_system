import React, { useState } from "react";
import Button from "../../../components/ui/Button";
import RatingStars from "./RatingStars";
import { Send } from "lucide-react";

const FeedbackForm = ({ onSubmit, employeeName }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    strengths: "",
    improvements: "",
    comments: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Évaluation globale
        </label>
        <RatingStars
          rating={formData.rating}
          onChange={(value) => setFormData({ ...formData, rating: value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Points forts
        </label>
        <textarea
          value={formData.strengths}
          onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
          placeholder="Quels sont les points forts de cette personne ?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Axes d'amélioration
        </label>
        <textarea
          value={formData.improvements}
          onChange={(e) => setFormData({ ...formData, improvements: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
          placeholder="Quels sont les axes d'amélioration ?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Commentaires additionnels
        </label>
        <textarea
          value={formData.comments}
          onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
          placeholder="Autres commentaires..."
        />
      </div>

      <Button type="submit" icon={Send} className="w-full">
        Envoyer le feedback
      </Button>
    </form>
  );
};

export default FeedbackForm;
