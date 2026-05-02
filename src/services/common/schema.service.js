// 🔥 helper: slugify (VERY IMPORTANT)
const slugify = (text = "") =>
  text
    .toLowerCase()
    .replace(/^\d+\.\s*/, "") // remove "1. "
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const generateSchema = (page) => {
  if (!page.tools || page.tools.length === 0) return null;

  // ✅ USE PRODUCTION DOMAIN (VERY IMPORTANT)
  const BASE_URL = process.env.FRONTEND_URL || "https://aicorner.net";

  // ✅ category support (fallback safe)
  const categorySlug = page.category?.slug || "tools";

  const pageUrl = `${BASE_URL}/${categorySlug}/${page.slug}`;

  // 🟢 1. PRODUCT NODES
  const productNodes = page.tools.map((tool, index) => {
    const cleanName = tool.name.replace(/^\d+\.\s*/, "");
    const toolSlug = slugify(cleanName);
    const toolId = `${pageUrl}#${toolSlug}`;

    return {
      "@type": ["Product", "SoftwareApplication"],
      "@id": toolId,

      name: cleanName,
      image: tool.image,
      description: tool.customDescription,
      url:tool.link,

      applicationCategory: page.category.name, // ✅ IMPORTANT

      brand: {
        "@type": "Brand",
        name: tool.brand,
      },

      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: tool.ratingValue?.toString() || "4",
        bestRating: "5",
        worstRating: "1",
        ratingCount: tool.ratingCount?.toString() || "100",
      },
    };
  });

  // 🟢 2. ITEM LIST
  const itemList = {
    "@type": "ItemList",
    "@id": `${pageUrl}#product-list`,

    name: page.title, // ✅ ADD
    url: pageUrl,     // ✅ ADD
    numberOfItems: page.tools.length, // ✅ ADD
    itemListOrder: "ItemListOrderAscending", // ✅ ADD

    itemListElement: page.tools.map((tool, index) => {
      const cleanName = tool.name.replace(/^\d+\.\s*/, "");
      const toolSlug = slugify(cleanName);

      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@id": `${pageUrl}#${toolSlug}`,
        },
      };
    }),
  };

  // 🟢 FINAL GRAPH
  const graph = [itemList, ...productNodes];

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
};