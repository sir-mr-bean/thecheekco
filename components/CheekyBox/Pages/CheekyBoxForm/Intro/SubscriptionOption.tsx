const SubscriptionOption = ({ price }: { price: string }) => {
  return (
    <div className="w-full h-[360px]  sm:h-[420px] rounded-xl bg-button shadow-sm max-w-xs">
      <span>{price}</span>
    </div>
  );
};

export default SubscriptionOption;
