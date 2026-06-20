export const parseMultipartJson = (
  req,
  res,
  next
) => {
  try {

    const jsonFields = [
      "meta",
      "tools",
      "faq",
      "catImage",
      "seo",
    ];

    jsonFields.forEach((field) => {

      const value =
        req.body[field];

      if (
        typeof value ===
        "string"
      ) {
        req.body[field] =
          JSON.parse(value);
      }

    });

    next();

  } catch (err) {

    return res.status(400).json({
      success: false,
      message:
        "Invalid JSON payload",
    });
  }
};