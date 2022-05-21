import Image from "next/image";

function FrontOfImage({ product }) {
  return (
    <div className="absolute inset-0 w-full h-full flex justify-center items-center bg-gray-900 transition-all duration-100 delay-150 z-20 hover:opacity-0">
      <Image
        layout="fill"
        src={product.itemimage?.data?.[0]?.attributes.url}
        alt={product.itemimage?.data?.[0]?.attributes.imagealttext}
        className="w-full h-full object-center object-cover"
      />
      <div className="absolute top-0 inset-x-0 h-72 rounded-lg p-4 flex items-end justify-end overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
        />
        <p className="relative text-lg font-semibold text-white">
          ${product.price.toFixed(2).toLocaleString("en-us")}
        </p>
      </div>
    </div>
  );
}

function BackOfImage({ product }) {
  return (
    <div className="absolute inset-0 w-full h-full flex justify-center items-center bg-black transition-all z-10 card-back">
      <div className="bg-black bg-cover w-full h-full flex justify-center items-center">
        <span className="text-center text-white p-2">
          {product.shortdescription}
        </span>
        <Image
          layout="fill"
          src={product.itemimage?.data?.[0]?.attributes.url}
          alt={product.itemimage?.data?.[0]?.attributes.imagealttext}
          className="w-full h-full object-center object-cover opacity-30"
        />
      </div>
    </div>
  );
}

export default function FlipHover({ product }) {
  return (
    <div className="relative w-full h-full rounded-2xl text-white overflow-hidden cursor-pointer transition-all duration-700 card">
      <FrontOfImage product={product} />
      <BackOfImage product={product} />
    </div>
  );
}
