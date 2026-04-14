import bcrypt from "bcrypt";
import { User } from "../../models/user.model.js";

// LOGIN SERVICE
export const loginUser = async ({ email, password }) => {
  // ✅ Mongo query (no 'where')
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  return {
    // ✅ Mongo uses _id
    id: user._id,
    email: user.email,
    role: user.role,
  };
};

// LOGOUT SERVICE (session-based)
export const logoutUser = async (req) => {
  return new Promise((resolve, reject) => {
    req.session.destroy((err) => {
      if (err) {
        const error = new Error("Logout failed");
        error.status = 500;
        return reject(error);
      }

      resolve({ message: "Logout successful" });
    });
  });
};