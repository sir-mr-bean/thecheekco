export default async function handler(req, res) {
  try {
    let sqProducts = `https://${process.env.SQUARE_API_URL}/v2/catalog/search`;
    const categories = [];
    let cursor = null;
    do {
      if (cursor != null)
        sqProducts = `https://${process.env.SQUARE_API_URL}/v2/catalog/search?cursor=${cursor}`;
      const res = await fetch(sqProducts, {
        method: "POST",
        headers: {
          "User-Agent": "*",
          "Square-Version": "2022-05-12",
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          include_related_objects: true,
          object_types: ["ITEM"],
        }),
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch posts, received status ${res.status}`);
      }
      const data = await res.json();
      const products = data.objects.map((item) => {
        const currentImage = data.related_objects.filter(
          (image) => image.id === item.item_data.image_ids?.[0]
        );
        const currentCategory = data.related_objects.filter(
          (category) => category.id === item.item_data.category_id
        );
        return {
          id: item.id,
          name: item.item_data.name,
          description: item?.item_data?.description,
          variations: item.item_data.variations,
          image: currentImage?.[0]?.image_data?.url,
          category: currentCategory?.[0],
          item: item,
        };
      });
      categories.push(products);
      cursor = data.cursor;
    } while (cursor != "" && cursor != null);
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json(error);
  }
}
