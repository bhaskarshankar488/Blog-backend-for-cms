export const PERMISSIONS = {
  admin: {
    users: ["create", "read", "update", "delete"],
    tools: ["create", "read", "update", "delete"],   // ✅ ADD
    pages: ["create", "read", "update", "delete"],   // ✅ ADD
    categories: ["create", "read", "update", "delete"], // ✅ ADD
    finance: ["create", "read", "update", "delete"],
  },

  analyst: {
    users: [],
    tools: ["read"],
    pages: ["read"],
    categories: ["read"], // ✅ ADD
    finance: ["read"],
  },

  viewer: {
    users: [],
    tools: ["read"],
    categories: ["read"], // ✅ ADD
    pages: ["read"],
    finance: [],
  },
};