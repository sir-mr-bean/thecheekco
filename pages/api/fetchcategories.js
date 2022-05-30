export default async function handler(req, res) {
  try {
    let sqCategories = `https://connect.squareup.com/v2/catalog/list?types=category`;
    const categories = [];
    let cursor = null;
    do {
      if (cursor != null)
        sqCategories = `https://connect.squareup.com/v2/catalog/list?types=category&cursor=${cursor}`;
      const res = await fetch(sqCategories, {
        headers: {
          "User-Agent": "*",
          "Square-Version": "2022-05-12",
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
        },
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch posts, received status ${res.status}`);
      }
      const data = await res.json();
      //console.log(data);
      categories.push(...data.objects);
      cursor = data.cursor;
    } while (cursor != "" && cursor != null);
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json(error);
  }
}
