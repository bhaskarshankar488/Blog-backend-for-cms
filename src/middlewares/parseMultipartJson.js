// middleware/parseMultipartJson.js

export const parseMultipartJson = (
  req,
  res,
  next
) => {
      console.log(
    "parseMultipartJson reached"
  );
  try {

    if (req.body.meta) {
      req.body.meta =
        JSON.parse(req.body.meta);
    }

    if (req.body.tools) {
      req.body.tools =
        JSON.parse(req.body.tools);
    }

    if (req.body.faq) {
      req.body.faq =
        JSON.parse(req.body.faq);
    }

    if (
      req.body.catImage &&
      typeof req.body.catImage ===
        "string"
    ) {
      req.body.catImage =
        JSON.parse(req.body.catImage);
    }

    next();

  } catch (err) {

    return res.status(400).json({
      success: false,
      message:
        "Invalid JSON payload",
    });
  }
};