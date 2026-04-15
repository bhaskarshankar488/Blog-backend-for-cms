export const generateSchema = (page) => {
  if (!page.tools?.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: page.tools.map((tool, index) => ({
      "@type": "Product",
      position: index + 1,
      name: tool.name,
      description: tool.description,
      image: tool.image,
      brand: {
        "@type": "Brand",
        name: tool.brand,
      },
    })),
  };
};