export default function Home(props) {
  const offers = [
    {
      name: "Download the app",
      description: "Get an exclusive $5 off code",
      href: "#",
    },
    {
      name: "Return when you're ready",
      description: "60 days of free returns",
      href: "#",
    },
    {
      name: "Sign up for our newsletter",
      description: "15% off your first order",
      href: "#",
    },
  ];
  console.log(props);
  return (
    <div>
      <div>
        <nav aria-label="Offers" className="order-last lg:order-first pt-3">
          <div className="max-w-7xl mx-auto lg:px-8">
            <ul
              role="list"
              className="grid grid-cols-1 divide-y divide-text-primary lg:grid-cols-3 lg:divide-y-0 lg:divide-x"
            >
              {offers.map((offer) => (
                <li key={offer.name} className="flex flex-col">
                  <a
                    href={offer.href}
                    className="relative flex-1 flex flex-col justify-center  py-6 px-4 text-center focus:z-10"
                  >
                    <p className="text-xs sm:text-sm text-text-secondary">
                      {offer.name}
                    </p>
                    <p className="font-semibold text-text-primary">
                      {offer.description}
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}
