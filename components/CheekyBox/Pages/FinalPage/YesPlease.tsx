import { AiOutlineCheck } from "react-icons/ai";

const YesPlease = ({ item }: { item: string }) => {
  return (
    <div className="flex items-center space-x-3">
      <AiOutlineCheck />
      <span>{item} Please!</span>
    </div>
  );
};

export default YesPlease;
