import { ReactElement, useMemo, useState } from "react";
import { BsStarFill, BsStar, BsStarHalf } from "react-icons/bs";
import useHover from "@/utils/useHover";

const NewReview = ({ rating, setRating }) => {
  const [hover, setHover] = useState(0);
  console.log;
  return (
    <div className="star-rating">
      {[...Array(5)].map((star, index) => {
        index += 1;
        return (
          <BsStar
            key={index}
            onClick={() => setRating(index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(0)}
            className={`${hover >= index ? "hover" : ""}`}
          />
          // );

          //   <button
          //     type="button"
          //     key={index}
          //     className={index <= (hover || rating) ? "on" : "off"}
          //     onClick={() => setRating(index)}
          //     onMouseEnter={() => setHover(index)}
          //     onMouseLeave={() => setHover(rating)}
          //   >
          //     <span className="star">&#9733;</span>
          //   </button>
        );
      })}
    </div>
  );
};

export default NewReview;
