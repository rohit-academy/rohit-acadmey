import React from "react";
import { Star } from "lucide-react";

function RatingStars({ rating = 4, reviews = 120 }) {
  return (
    <div className="flex items-center gap-1 text-sm">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={16}
          className={
            i <= rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          }
        />
      ))}
      <span className="text-gray-600 ml-1">({reviews})</span>
    </div>
  );
}

export default RatingStars;
