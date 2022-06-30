import { useEffect, useRef, useState } from "react";
import { useInViewport } from "react-in-viewport";
import { RoughNotation } from "react-rough-notation";
import { CatalogObject } from "square";
import { slugify } from "@/utils/hooks/useSlugify";
import Link from "next/link";
import Image from "next/image";
import { ProductReview } from "@prisma/client";
import Stars from "../Reviews/Stars";

const AllNatural = ({
  productsData,
  categoriesData,
  productReviewsData,
  handleAdd,
}: {
  productsData: CatalogObject[];
  categoriesData: CatalogObject[];
  productReviewsData: ProductReview[];
  handleAdd: (product: CatalogObject) => void;
}) => {
  const notationRef = useRef(null);
  const { inViewport } = useInViewport(notationRef);
  const [randomAllNatural, setRandomAllNatural] = useState<CatalogObject[]>([]);

  useEffect(() => {
    const allNaturalProducts = productsData?.filter(
      (p) =>
        p.itemData?.variations?.[0]?.customAttributeValues?.[
          "Square:a1089928-7880-407e-93f3-08dfe506ac14"
        ]?.booleanValue === true
    );
    if (allNaturalProducts) {
      const randomProducts = allNaturalProducts
        .sort(() => 0.5 - Math.random())
        .slice(0, 6);
      setRandomAllNatural(randomProducts);
    }
  }, [productsData]);

  return (
    <section>
      <div className="flex flex-col w-full sm:p-6 items-center justify-center pt-32">
        <div className="flex items-center justify-center pt-8">
          <span className="text-2xl sm:text-5xl text-text-primary font-gothic text-center">
            Check out our fav
          </span>
        </div>
        <div
          ref={notationRef}
          className="flex items-center justify-center w-full text-3xl sm:text-6xl lg:text-7xl text-text-secondary font-gothic text-center py-3 space-x-2 sm:space-x-3"
        >
          <span className="w-fit mr-3">all</span>
          <RoughNotation
            type="circle"
            color="#E3BB9D"
            show={inViewport}
            animate
            animationDelay={500}
            animationDuration={1000}
            strokeWidth={4}
            padding={[12, 8]}
          >
            <span className="">natural</span>
          </RoughNotation>
          <span>picks.</span>
        </div>
        <div className="flex flex-wrap w-full h-fit items-center justify-center pt-10">
          {randomAllNatural &&
            randomAllNatural.map((product) => {
              const productImage = productsData?.find(
                (p) =>
                  p.type === "IMAGE" &&
                  product?.itemData?.imageIds?.includes(p.id)
              );
              const productCategory = categoriesData?.find(
                (category) => category.id === product?.itemData?.categoryId
              );
              const productReview = productReviewsData?.find(
                (review) => review.productId === product?.id
              );
              return (
                <div className="flex flex-col items-center justify-center w-fit">
                  <Link
                    key={product.id}
                    href={`/shop/${productCategory?.categoryData?.name}/${product.itemData?.name}`}
                    as={`/shop/${slugify(
                      productCategory?.categoryData?.name as string
                    )}/${slugify(product.itemData?.name as string)}`}
                    className="relative overflow-hidden"
                  >
                    <div className="flex flex-col justify-center items-center h-32 w-32 m-4 md:m-4 cursor-pointer hover:scale-105">
                      <div className="relative h-full w-full">
                        <Image
                          priority={true}
                          src={
                            productImage?.imageData?.url ||
                            "https://thecheekcomedia.s3.ap-southeast-2.amazonaws.com/placeholder-image.png"
                          }
                          width={150}
                          height={150}
                          objectFit="cover"
                          layout="responsive"
                          className="rounded-md"
                        />
                      </div>
                      <span className="text-xs sm:text-sm  text-text-primary w-full text-left py-2">
                        {product?.itemData?.name}
                      </span>
                    </div>
                  </Link>
                  <div className="w-full flex items-center justify-start pl-3 pt-2">
                    <Stars review={productReview} />
                  </div>
                  <div className="w-full flex items-center justify-start pl-3 pt-2">
                    <span className="text-text-primary text-xs sm:text-sm">
                      $
                      {(
                        Number(
                          product.itemData?.variations?.[0].itemVariationData
                            ?.priceMoney?.amount
                        ) / 100
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-2">
                    <button
                      onClick={() => handleAdd(product)}
                      className="relative flex w-fit mx-auto bg-button rounded-2xl py-2 px-8 items-center justify-center text-sm font-medium text-white border border-invisible hover:border-black uppercase cursor-pointer"
                    >
                      Add to cart
                      <span className="sr-only">{product.itemData?.name}</span>
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default AllNatural;
