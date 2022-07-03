import {
  BsEmojiHeartEyesFill,
  BsFillCalendarCheckFill,
  BsHeartFill,
} from "react-icons/bs";
import { FaKissWinkHeart, FaShippingFast } from "react-icons/fa";
import { HiCursorClick } from "react-icons/hi";

const offers = [
  {
    name: "Free Shipping on orders over $100",
    icon: "FaShippingFast",
    href: "/shipping-policy",
  },
  {
    name: "Check out our in-store events",
    icon: "BsFillCalendarCheckFill",
    href: "/events",
  },
  {
    name: "Click & Collect",
    icon: "HiCursorClick",
    href: "/click-and-collect",
  },
];

const Events = () => {
  const Icon = (iconName: string) => {
    switch (iconName) {
      case "FaKissWinkHeart":
        return <FaKissWinkHeart size={25} />;
      case "FaShippingFast":
        return <FaShippingFast size={25} />;
      case "HiCursorClick":
        return <HiCursorClick size={25} />;
      case "BsHeartFill":
        return <BsHeartFill size={25} />;
      case "BsEmojiHeartEyesFill":
        return <BsEmojiHeartEyesFill size={25} />;
      case "BsFillCalendarCheckFill":
        return <BsFillCalendarCheckFill size={25} />;
      default:
        return <div>{iconName}</div>;
    }
  };

  return (
    <>
      <nav
        aria-label="Offers"
        className="order-last lg:order-first my-1 sm:my-3 relative z-20"
      >
        <div className="max-w-5xl mx-auto lg:px-8">
          <ul
            role="list"
            className="grid grid-cols-3  divide-text-primary divide-x"
          >
            {offers.map((offer) => (
              <li key={offer.name} className="flex flex-col ">
                <a
                  href={offer.href}
                  className="relative flex-1 flex flex-col justify-between pt-3 sm:py-2 px-2 text-center space-y-2"
                >
                  <div className="text-text-primary mx-auto  h-6 w-6 flex items-center justify-center ">
                    {Icon(`${offer.icon}`)}
                  </div>
                  <p className="hidden sm:block text-xs sm:text-sm text-text-secondary">
                    {offer.name}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Events;
