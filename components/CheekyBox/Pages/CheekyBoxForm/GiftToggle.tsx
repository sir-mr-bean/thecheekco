const GiftToggle = ({
  gift,
  setGift,
}: {
  gift: boolean;
  setGift: (gift: boolean) => void;
}) => {
  return (
    <div className="flex flex-col w-full items-start justify-start space-y-3 py-4">
      <div className="flex space-x-2">
        <input
          type="radio"
          id="gift-toggle-1"
          name="gift-toggle"
          onChange={() => setGift(false)}
          className="accent-text-primary"
          defaultChecked={true}
        />
        <label
          htmlFor="gift-toggle-1"
          className="flex flex-col items-center justify-center font-gothic text-text-primary text-base"
        >
          For Myself
        </label>
      </div>
      <div className="flex space-x-2">
        <input
          type="radio"
          id="gift-toggle-2"
          name="gift-toggle"
          onChange={() => setGift(true)}
          className="accent-text-primary"
        />
        <label
          htmlFor="gift-toggle-2"
          className="flex flex-col items-center justify-center font-gothic text-text-primary text-base"
        >
          For Someone Else
        </label>
      </div>
    </div>
  );
};

export default GiftToggle;
