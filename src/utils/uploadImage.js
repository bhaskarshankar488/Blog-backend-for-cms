import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

export const uploadImage = async (file) => {
  if (!file) {
    return {
      url: "",
      public_id: "",
    };
  }

  const uploaded = await uploadToCloudinary(
    file.buffer
  );

  return {
    url: uploaded.secure_url,
    public_id: uploaded.public_id,
  };
};


export const replaceImage = async (
  currentImage,
  newFile
) => {
  // no new image uploaded
  if (!newFile) {
    return currentImage;
  }

  // delete old image
  if (currentImage?.public_id) {
    await deleteFromCloudinary(
      currentImage.public_id
    );
  }

  // upload new image
  const uploaded = await uploadToCloudinary(
    newFile.buffer
  );

  return {
    url: uploaded.secure_url,
    public_id: uploaded.public_id,
  };
};