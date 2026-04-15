import axios from "axios";
import { successResponse } from "../utils/responseHandler.js";

export const revalidatePage = async (req, res) => {
  try {
    const { slug } = req.body;

    if (!process.env.FRONTEND_URL) {
      return successResponse(res, "Revalidation skipped (no frontend)");
    }

    try {
      await axios.post(`${process.env.FRONTEND_URL}/api/revalidate`, {
        slug,
      });
    } catch (err) {
      return successResponse(res, "Revalidation skipped (frontend not ready)");
    }

    return successResponse(res, "Page revalidated successfully");
  } catch (error) {
    return successResponse(res, "Revalidation skipped");
  }
};