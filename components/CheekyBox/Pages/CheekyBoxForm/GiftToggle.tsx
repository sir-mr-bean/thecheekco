const GiftToggle = ({
  gift,
  setGift,
}: {
  gift: boolean;
  setGift: (gift: boolean) => void;
}) => {
  return (
    <div className="flex w-full items-center justify-start py-4">
      <span className="pr-4 text-sm text-text-primary sm:text-base">
        Who is this box to be sent to?
      </span>
      <div className="flex flex-col items-center justify-center space-y-6 whitespace-nowrap text-xs sm:flex-row sm:space-y-0 sm:space-x-2 sm:text-sm">
        <button onClick={() => setGift(false)}>
          <span
            className={
              gift === false
                ? `w-36 rounded-lg border border-text-secondary bg-button py-2 px-3 font-semibold text-text-primary sm:w-48 lg:w-72 lg:px-20 `
                : `w-36 rounded-lg border border-transparent border-text-secondary bg-bg-tan px-3 py-2 font-semibold text-text-primary hover:border-text-primary sm:w-48 lg:w-72 lg:px-20   `
            }
          >
            myself
          </span>
        </button>
        <button onClick={() => setGift(true)}>
          <span
            className={
              gift === true
                ? `w-36 rounded-lg border border-text-secondary bg-button py-2 px-3 font-semibold text-text-primary sm:w-48 lg:w-72 lg:px-20 `
                : `w-36 rounded-lg border border-transparent border-text-secondary bg-bg-tan px-3 py-2 font-semibold text-text-primary hover:border-text-primary sm:w-48 lg:w-72 lg:px-20   `
            }
          >
            as a gift(for someone else)
          </span>
        </button>
      </div>
    </div>
  );
};

export default GiftToggle;
