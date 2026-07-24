import mongoose from "mongoose";
import Subscriber from "../../../../modules/email-subscription/models/subscriber.model.js";

export const getSubscribers = async ({
  page = 1,
  limit = 10,
  search = "",
}) => {
  page = Number(page);
  limit = Number(limit);

  const filter = {};

  if (search) {
    filter.email = {
      $regex: search,
      $options: "i",
    };
  }

  const [items, total] = await Promise.all([
    Subscriber.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),

    Subscriber.countDocuments(filter),
  ]);

  return {
    message: "Subscribers fetched successfully.",
    data: {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
  };
};

export const deleteSubscriber = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid subscriber id.");
    error.status = 400;
    throw error;
  }

  const subscriber = await Subscriber.findByIdAndDelete(id);

  if (!subscriber) {
    const error = new Error("Subscriber not found.");
    error.status = 404;
    throw error;
  }

  return {
    message: "Subscriber deleted successfully.",
    data: subscriber,
  };
};