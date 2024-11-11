import configureOpenAPI from "@/lib/configure-open-api";
import createApp from "@/lib/create-app";
import index from "@/routes/index.route";
import auth from "@/routes/auth/auth.index";
import news from "@/routes/news/news.index";

const app = createApp();

const routes = [index, auth, news];

configureOpenAPI(app);

routes.forEach((route) => {
  app.route("/", route);
});

export default app;
