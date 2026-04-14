// config/permissions.js

export const PERMISSIONS = {
  admin: {
    users: ["create", "read", "update", "delete"],
    finance: ["create", "read", "update", "delete"],
  },
  analyst: {
    users: [],
    finance: ["read"],
  },
  viewer: {
    users: [],
    finance: [],
  },
};