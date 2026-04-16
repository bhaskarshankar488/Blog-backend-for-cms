import * as userService from "../services/user/user.service.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";


// CREATE
export const createUser = async (req, res) => {
  try {
    const result = await userService.createUser(req.body);

    return successResponse(res, result.message, result.data, 201);

  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
};


// UPDATE
export const updateUser = async (req, res) => {
  try {
    const result = await userService.updateUser(req.params.id, req.body);

    return successResponse(res, result.message, result.data);

  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
};


// UPDATE ROLE
export const updateUserRole = async (req, res) => {
  try {
    const result = await userService.updateUserRole(req.params.id, req.body.role);

    return successResponse(res, result.message, result.data);

  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
};


// DELETE
export const deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUser(req.params.id);

    return successResponse(res, result.message, result.data);

  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
};

// controllers/user.controller.js

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await userService.updateUserStatus(id, status);

    return successResponse(res, result.message, result.data);
  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
};

// GET ALL USERS
export const getUsers = async (req, res) => {
  try {
    const result = await userService.getUsers();

    return successResponse(res, result.message, result.data);

  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
};


// GET SINGLE USER
export const getUserById = async (req, res) => {
  try {
    const result = await userService.getUserById(req.params.id);

    return successResponse(res, result.message, result.data);

  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
};

