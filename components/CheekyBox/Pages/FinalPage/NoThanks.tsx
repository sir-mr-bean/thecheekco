import { AiOutlineClose } from "react-icons/ai";

const NoThanks = ({ item }: { item: string }) => {
  return (
    <div className="flex items-center space-x-3">
      <AiOutlineClose />
      <span>No {item}</span>
    </div>
  );
};

export default NoThanks;
