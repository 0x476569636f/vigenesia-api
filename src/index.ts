import configureOpenAPI from "@/lib/configure-open-api";
import createApp from "@/lib/create-app";
import auth from "@/routes/auth/auth.index";
import news from "@/routes/news/news.index";
import newsCategory from "@/routes/news-category/news-category.index";
import motivations from "@/routes/motivations/motivations.index";

const app = createApp();

const routes = [auth, news, newsCategory, motivations];

configureOpenAPI(app);

routes.forEach((route) => {
  app.route("/", route);
});

export default app;
