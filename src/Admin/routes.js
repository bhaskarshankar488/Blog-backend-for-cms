import emailSubscriptionRoutes from "./modules/email-subscription/index.js";

export default function registerAdminRoutes(app) {
  app.use(
    "/api/v1/admin/subscribers",
    emailSubscriptionRoutes
  );
}