import { WishlistState } from "@/context/Wishlist/Context";
import { useEffect, useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import Heart from "@/components/react-animated-heart/src/components/index";
import { CatalogObject } from "square";

const FavouriteButton = ({
  product,
  image,
  styles,
}: {
  product: CatalogObject;
  image: string;
  styles: any;
}) => {
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
      dispatch({ type: "REMOVE_FROM_WISHLIST", item: { product: product } });
    } else {
      dispatch({
        type: "ADD_TO_WISHLIST",
        item: { product: product, productImage: image },
      });
    }
    setIsFavourite((isFavourite) => !isFavourite);
  };

  return (
    <div className="relative scale-75 h-10 w-10">
      <Heart isClick={isFavourite} onClick={handleFavourite} styles={styles} />
    </div>
  );
};

export default FavouriteButton;
