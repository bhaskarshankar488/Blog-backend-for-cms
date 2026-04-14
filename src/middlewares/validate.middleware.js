export const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const data = req[property]; // ✅ dynamic source

    const { error } = schema.validate(data, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.map((err) => {
        const field = err.path.join(".");

        let message = err.message
          .replace(/"/g, "")
          .replace(/must be one of \[(.*)\]/, "must be one of: $1");

        message = message.charAt(0).toUpperCase() + message.slice(1);

        return { field, message };
      });

      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    next();
  };
};