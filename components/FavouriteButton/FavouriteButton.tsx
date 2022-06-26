import { WishlistState } from "@/context/Wishlist/Context";
import { useEffect, useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import Heart from "@/components/react-animated-heart/src/components/index";

const FavouriteButton = ({ product, image, styles }) => {
  const [isFavourite, setIsFavourite] = useState(false);
  const { wishlist, dispatch } = WishlistState();

  useEffect(() => {
    if (wishlist.length) {
      wishlist.forEach((item) => {
        if (item?.product?.id === product.id) {
          setIsFavourite(true);
        }
      });
    }
  }, [wishlist]);

  const handleFavourite = () => {
    if (isFavourite) {
      console.log("removing to wishlist");
      dispatch({ type: "REMOVE_FROM_WISHLIST", item: { product: product } });
    } else {
      console.log("adding to wishlist");
      dispatch({
        type: "ADD_TO_WISHLIST",
        item: { product: product, productImage: image },
      });
    }
    setIsFavourite(!isFavourite);
  };

  return (
    <div className="relative scale-75">
      <Heart isClick={isFavourite} onClick={handleFavourite} styles={styles} />
      {/* {isFavourite ? (
        <AiFillHeart
          size={30}
          className="text-red-500 cursor-pointer hover:scale-105"
          onClick={handleFavourite}
        />
      ) : (
        <AiOutlineHeart
          size={30}
          className="text-red-500 cursor-pointer hover:scale-105"
          onClick={handleFavourite}
        />
      )} */}
    </div>
  );
};

export default FavouriteButton;
