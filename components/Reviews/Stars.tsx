import { ProductReview } from "@prisma/client";
import { ReactElement } from "react";
import { BsStarFill, BsStar, BsStarHalf } from "react-icons/bs";
import { IconType } from "react-icons/lib";

const Stars = ({
  review,
  rating,
}: {
  review?: ProductReview;
  rating?: number;
}) => {
  const stars: ReactElement[] = [];
  if (review?.rating) {
    for (let i = 0; i < parseInt(review.rating.toString()); i++) {
      stars.push(<BsStarFill color="#602d0d" key={i} />);
    }
    if (parseFloat(review.rating.toString()) % 1 !== 0) {
      stars.push(<BsStarHalf color="#602d0d" key={stars.length} />);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<BsStar color="#602d0d" key={stars.length} />);
    }
  } else if (rating) {
    for (let i = 0; i < rating; i++) {
      stars.push(<BsStarFill key={i} />);
    }
    if (parseFloat(rating.toString()) % 1 !== 0) {
      stars.push(<BsStarHalf key={stars.length} />);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<BsStar key={stars.length} />);
    }
  } else {
    stars.push(<BsStar color="#602d0d" key={0} />);
    stars.push(<BsStar color="#602d0d" key={1} />);
    stars.push(<BsStar color="#602d0d" key={2} />);
    stars.push(<BsStar color="#602d0d" key={3} />);
    stars.push(<BsStar color="#602d0d" key={4} />);
  }
  return <div className="flex items-center justify-center">{stars}</div>;
};

export default Stars;
