export const serviceSuccess = (data, message = "") => {
  return {
    success: true,
    message,
    data,
  };
};

export const serviceError = (message, status = 500) => {
  const error = new Error(message);
  error.status = status;
  throw error;
};