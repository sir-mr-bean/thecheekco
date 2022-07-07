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
  subCategories,
}: {
  productsData: CatalogObject[];
  categoriesData: CatalogObject[];
  productReviewsData: ProductReview[];
  handleAdd: (product: CatalogObject) => void;
  subCategories: CatalogObject;
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
        .filter(
          (product) => product.itemData?.name !== "The Tea Tree Eucalyptus Mini"
        )
        .sort(() => 0.5 - Math.random())
        .slice(0, 6);
      setRandomAllNatural(randomProducts);
    }
  }, [productsData]);
  console.log("productsData", randomAllNatural);
  return (
    <section>
      <div className="flex w-full flex-col items-center justify-center sm:p-6 sm:pt-16">
        <div className="flex items-center justify-center pt-8">
          <span className="text-center font-gothic text-2xl text-text-primary sm:text-5xl">
            Check out our fav
          </span>
        </div>
        <div
          ref={notationRef}
          className="flex w-full items-center justify-center space-x-2 py-3 text-center font-gothic text-3xl text-text-secondary sm:space-x-3 sm:text-6xl lg:text-7xl"
        >
          <span className="mr-3 w-fit">all</span>
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
        <div className="flex w-full flex-auto flex-wrap items-center justify-center pt-10">
          {randomAllNatural &&
            subCategories &&
            randomAllNatural?.map((product) => {
              const productImage = productsData?.find(
                (p) =>
                  p.type === "IMAGE" &&
                  product?.itemData?.imageIds?.includes(p.id)
              );
              const productCategory = categoriesData?.find(
                (category) => category.id === product?.itemData?.categoryId
              );
              const productSubCategory =
                subCategories?.customAttributeDefinitionData?.selectionConfig?.allowedSelections?.find(
                  (subCategory) =>
                    subCategory.uid ===
                    product?.itemData?.variations?.[0]?.customAttributeValues?.[
                      "Square:c373acb7-e030-422a-bbcc-aae6e4f11958"
                    ]?.selectionUidValues?.[0]
                )?.name;
              const productReviews = productReviewsData?.filter(
                (review) => review.productId === product?.id
              );
              const averageReview =
                productReviews?.reduce(
                  (acc, curr) => acc + Number(curr.rating),
                  0
                ) / productReviews?.length;

              return (
                <div
                  key={product.id}
                  className="flex w-fit flex-col items-end justify-end pb-5"
                >
                  <Link
                    key={product.id}
                    href={`/shop/${productCategory?.categoryData?.name}/${product.itemData?.name}`}
                    as={`/shop/${slugify(
                      productCategory?.categoryData?.name as string
                    )}/${slugify(product.itemData?.name as string)}`}
                    className="relative overflow-hidden"
                  >
                    <div className="m-4 flex h-32 w-32 cursor-pointer flex-col items-center justify-center hover:scale-105 md:m-4">
                      <div className="relative w-full rounded-lg border border-text-secondary">
                        <Image
                          priority={true}
                          src={
                            productImage?.imageData?.url ||
                            "https://thecheekcomedia.s3.ap-southeast-2.amazonaws.com/placeholder-image.png"
                          }
                          alt={product.itemData?.name}
                          width={150}
                          height={150}
                          objectFit="cover"
                          layout="responsive"
                          className="rounded-md"
                        />
                      </div>
                      <span className=" w-full whitespace-nowrap text-left text-xs text-text-primary sm:text-sm">
                        {product?.itemData?.name}
                      </span>
                      <span className="w-full whitespace-nowrap pb-2 text-left text-xs text-text-primary sm:pb-4">
                        {productSubCategory}
                      </span>
                    </div>
                  </Link>
                  <div className="flex w-full items-center justify-start pl-3">
                    <Stars rating={averageReview} />
                    {productReviews?.length > 0 && (
                      <span className="pl-1 text-xs text-text-primary">
                        ({productReviews.length})
                      </span>
                    )}
                  </div>
                  <div className="flex w-full items-center justify-start pl-3 pt-2">
                    <span className="text-xs text-text-primary sm:text-sm">
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
                      className="border-invisible relative mx-auto flex w-fit cursor-pointer items-center justify-center rounded-2xl border bg-button py-2 px-8 text-sm font-medium uppercase text-white hover:border-black"
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
