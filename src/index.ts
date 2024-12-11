import configureOpenAPI from "@/lib/configure-open-api";
import createApp from "@/lib/create-app";
import auth from "@/routes/auth/auth.index";
import news from "@/routes/news/news.index";
import newsCategory from "@/routes/news-category/news-category.index";
import motivations from "@/routes/motivations/motivations.index";
import users from "@/routes/user/user.index";

const app = createApp();

const routes = [auth, news, newsCategory, motivations, users];

configureOpenAPI(app);

// Redirect to /reference
app.all("/", (c) => {
  return c.redirect("/reference");
});

routes.forEach((route) => {
  app.route("/", route);
});

export default app;
