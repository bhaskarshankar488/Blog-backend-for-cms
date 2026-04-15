export const PERMISSIONS = {
  admin: {
    users: ["create", "read", "update", "delete"],
    tools: ["create", "read", "update", "delete"],   // ✅ ADD
    pages: ["create", "read", "update", "delete"],   // ✅ ADD
    finance: ["create", "read", "update", "delete"],
  },

  analyst: {
    users: [],
    tools: ["read"],
    pages: ["read"],
    finance: ["read"],
  },

  viewer: {
    users: [],
    tools: ["read"],
    pages: ["read"],
    finance: [],
  },
};