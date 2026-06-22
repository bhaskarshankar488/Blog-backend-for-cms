import Alternative from "./alternative.model.js";

export const createAlternative = async (data, userId) => {
  const existing = await Alternative.findOne({ slug: data.slug, });

  if (existing) {
    const error = new Error(
      "Alternative slug already exists"
    );
    error.status = 409;
    throw error;
  }

  const alternative = await Alternative.create({
    ...data,
    createdBy: userId,
    updatedBy: userId,
  });

  return {
    message:
      "Alternative created successfully",
    data: alternative,
  };
};

export const updateAlternative = async (
  id,
  data,
  userId
) => {
  const alternative = await Alternative.findById(id);

  if (!alternative) {
    const error = new Error(
      "Alternative not found"
    );
    error.status = 404;
    throw error;
  }

  if (data.slug && data.slug !== alternative.slug) {
    const slugExists = await Alternative.findOne({
      slug: data.slug,
      _id: { $ne: id },
    });

    if (slugExists) {
      const error = new Error(
        "Alternative slug already exists"
      );
      error.status = 409;
      throw error;
    }
  }

  const updated = await Alternative.findByIdAndUpdate(
    id,
    {
      ...data,
      updatedBy: userId,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return {
    message:
      "Alternative updated successfully",
    data: updated,
  };
};

export const getAlternativeById =
  async (id) => {
    const alternative =
      await Alternative.findById(id)
        .populate(
          "tools.toolId",
          "name brand slug customDescription position"
        )
        .populate(
          "createdBy",
          "name email"
        )
        .populate(
          "updatedBy",
          "name email"
        );

    if (!alternative) {
      const error = new Error(
        "Alternative not found"
      );
      error.status = 404;
      throw error;
    }

    return {
      message:
        "Alternative fetched successfully",
      data: alternative,
    };
  };

export const getAlternatives =
  async () => {
    const alternatives =
      await Alternative.find()
        .sort({
          createdAt: -1,
        });

    return {
      message:
        "Alternatives fetched successfully",
      data: alternatives,
    };
  };

export const deleteAlternative =
  async (id) => {
    const alternative =
      await Alternative.findById(id);

    if (!alternative) {
      const error = new Error(
        "Alternative not found"
      );
      error.status = 404;
      throw error;
    }

    await alternative.deleteOne();

    return {
      message:
        "Alternative deleted successfully",
      data: null,
    };
  };