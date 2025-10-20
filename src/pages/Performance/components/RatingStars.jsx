import React, { useState } from "react";

const RatingStars = ({ rating = 0, onChange, readonly = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value) => {
    if (!readonly && onChange) {
      onChange(value);
    }
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          disabled={readonly}
          className={`text-2xl transition-colors ${
            readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
          } ${
            star <= (hoverRating || rating)
              ? "text-yellow-400"
              : "text-gray-300"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default RatingStars;
