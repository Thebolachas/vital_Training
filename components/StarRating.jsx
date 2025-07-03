import React, { useState } from 'react';

export default function StarRating({ onRatingChange }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleClick = (ratingValue) => {
    setRating(ratingValue);
    onRatingChange(ratingValue);
  };

  return (
    <div className="flex justify-center items-center">
      {[...Array(5)].map((star, index) => {
        const ratingValue = index + 1;
        return (
          <button
            type="button"
            key={index}
            className={`text-4xl transition-colors ${ratingValue <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'}`}
            onClick={() => handleClick(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(0)}
          >
            &#9733; {/* Star character */}
          </button>
        );
      })}
    </div>
  );
}