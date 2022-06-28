import { useState } from "react";
import { RatingIcon } from "./RatingIcon";

const NewReview = ({ rating, setRating }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const onMouseEnter = (index: number) => {
    setHoverRating(index);
  };
  const onMouseLeave = () => {
    setHoverRating(0);
  };
  const onSaveRating = (index) => {
    setRating(index);
  };
  return (
    <div className="box flex">
      {[1, 2, 3, 4, 5].map((index) => {
        return (
          <RatingIcon
            index={index}
            rating={rating}
            hoverRating={hoverRating}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onSaveRating={onSaveRating}
          />
        );
      })}
    </div>
  );
};

export default NewReview;
