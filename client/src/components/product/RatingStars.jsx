import React from "react";
import { Star } from "lucide-react";

function RatingStars({ rating = 4.3, reviews = 120 }) {

  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;

  const formatReviews = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num;
  };

  return (

    <div className="flex items-center gap-2 text-sm">

      {/* Stars */}
      <div className="flex items-center">

        {[...Array(5)].map((_, i) => {

          const starIndex = i + 1;

          if (starIndex <= fullStars) {

            return (
              <Star
                key={i}
                size={16}
                className="text-yellow-400 fill-yellow-400 transition-transform duration-200 hover:scale-110"
              />
            );

          }

          if (starIndex === fullStars + 1 && halfStar) {

            return (
              <div key={i} className="relative">

                <Star size={16} className="text-gray-300" />

                <Star
                  size={16}
                  className="absolute top-0 left-0 text-yellow-400 fill-yellow-400 overflow-hidden"
                  style={{ clipPath: "inset(0 50% 0 0)" }}
                />

              </div>
            );

          }

          return (
            <Star
              key={i}
              size={16}
              className="text-gray-300"
            />
          );

        })}

      </div>

      {/* Rating Number */}
      <span className="font-medium text-gray-700">
        {rating.toFixed(1)}
      </span>

      {/* Reviews */}
      <span className="text-gray-500">
        ({formatReviews(reviews)} reviews)
      </span>

    </div>

  );

}

export default RatingStars;