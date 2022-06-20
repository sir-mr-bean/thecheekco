import getConfig from "next/config";

export default async function handler(req, res) {
  const { serverRuntimeConfig } = getConfig();
  try {
    let sqCategories = `https://${serverRuntimeConfig.squareAPIURL}/v2/catalog/list?types=category`;
    const categories = [];
    let cursor = null;
    do {
      if (cursor != null)
        sqCategories = `https://${serverRuntimeConfig.squareAPIURL}/v2/catalog/list?types=category&cursor=${cursor}`;
      const res = await fetch(sqCategories, {
        headers: {
          "Square-Version": "2022-05-12",
          "Content-Type": "application/json",
          Authorization: `Bearer ${serverRuntimeConfig.squareAccessToken}`,
        },
      });

      if (!res.ok) {
        throw new Error(
          `Failed to fetch categories from Square, received status ${res.status}`
        );
      }
      const data = await res.json();
      categories.push(...data.objects);
      cursor = data.cursor;
    } while (cursor != "" && cursor != null);
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json(error);
  }
}
