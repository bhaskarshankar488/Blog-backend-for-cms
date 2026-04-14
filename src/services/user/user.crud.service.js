import bcrypt from "bcrypt";
import { User } from "../../models/user.model.js";
import { serviceSuccess, serviceError } from "../../utils/serviceResponse.js";

// CREATE USER
export const createUser = async (userData) => {
  const { name, email, password, role } = userData;

  // ✅ FIX
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw serviceError("Email already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  const userResponse = newUser.toObject();
  delete userResponse.password;

  return serviceSuccess(userResponse, "User created successfully");
};

// UPDATE USER
export const updateUser = async (userId, data) => {
  const user = await User.findById(userId);

  if (!user) {
    throw serviceError("User not found", 404);
  }

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  const updatedUser = await User.findByIdAndUpdate(userId, data, {
    new: true,
  });

  const result = updatedUser.toObject();
  delete result.password;

  return serviceSuccess(result, "User updated successfully");
};

// UPDATE ROLE
export const updateUserRole = async (userId, role) => {
  const user = await User.findById(userId);

  if (!user) {
    throw serviceError("User not found", 404);
  }

  user.role = role;
  await user.save();

  const result = user.toObject();
  delete result.password;

  return serviceSuccess(result, "User role updated successfully");
};

// DELETE USER
export const deleteUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw serviceError("User not found", 404);
  }

  // Check admin count
  if (user.role === "admin") {
    const adminCount = await User.countDocuments({ role: "admin" });

    if (adminCount === 1) {
      throw serviceError(
        "You are the only admin. Cannot delete this account.",
        400
      );
    }
  }

  const userData = user.toObject();
  delete userData.password;

  await User.findByIdAndDelete(userId);

  return serviceSuccess(userData, "User deleted successfully");
};

// UPDATE STATUS
export const updateUserStatus = async (userId, status) => {
  const user = await User.findById(userId);

  if (!user) {
    throw serviceError("User not found", 404);
  }

  const userData = user.toObject();
  delete userData.password;

  if (user.status === status) {
    return serviceSuccess(userData, `User already ${status}`);
  }

  user.status = status;
  await user.save();

  const updatedUser = user.toObject();
  delete updatedUser.password;

  return serviceSuccess(updatedUser, "User status updated successfully");
};

// GET ALL USERS
export const getUsers = async () => {
  const users = await User.find();

  const formattedUsers = users.map((user) => {
    const u = user.toObject();
    delete u.password;
    return u;
  });

  return serviceSuccess(formattedUsers, "Users fetched successfully");
};

// GET SINGLE USER
export const getUserById = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw serviceError("User not found", 404);
  }

  const userData = user.toObject();
  delete userData.password;

  return serviceSuccess(userData, "User fetched successfully");
};