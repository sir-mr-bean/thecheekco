import { useMemo } from "react";
import { StarIcon } from "./StarIcon";
interface props {
  index: number;
  rating: number;
  hoverRating: number;
  onMouseEnter: (index: number) => void;
  onMouseLeave: () => void;
  onSaveRating: (rating: number) => void;
}

export function RatingIcon(props: props) {
  const {
    index,
    rating,
    hoverRating,
    onMouseEnter,
    onMouseLeave,
    onSaveRating,
  } = props;
  const fill = useMemo(() => {
    if (hoverRating >= index) {
      return "#602d0d";
    } else if (!hoverRating && rating >= index) {
      return "#602d0d";
    }
    return "none";
  }, [rating, hoverRating, index]);
  return (
    <div
      className="cursor-pointer"
      onMouseEnter={() => onMouseEnter(index)}
      onMouseLeave={() => onMouseLeave()}
      onClick={() => onSaveRating(index)}
    >
      <StarIcon fill={fill} />
    </div>
  );
}
