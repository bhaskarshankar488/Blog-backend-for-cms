import Alternative from "./alternative.model.js";

export const createAlternative = async (
  data,
  userId
) => {
  const existing =
    await Alternative.findOne({
      slug: data.slug,
    });

  if (existing) {
    const error =
      new Error(
        "Alternative slug already exists"
      );

    error.status = 409;
    throw error;
  }

  const alternative =
    await Alternative.create({
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
        ).populate(
          "toolId",
          "name brand slug"
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
  async (search = "") => {
    const filter = {};

    if (search?.trim()) {
      filter.$or = [
        {
          title: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          slug: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }
    const alternatives =
      await Alternative.find(filter)
        .select(
          "_id slug title toolId"
        )
        .populate(
          "toolId",
          "images.tool.url"
        )
        .sort({
          createdAt: -1,
        });

    const data = alternatives.map(
      (item) => ({
        _id: item._id,
        title: item.title,
        slug: item.slug,
        image:
          item.toolId?.images?.tool?.url ||
          "",
      })
    );

    return {
      message:
        "Alternatives fetched successfully",
      data: data,
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