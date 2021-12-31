const express = require("express");
const next = require("next");
const { publicRuntimeConfig, serverRuntimeConfig } = require("./next.config");
const { isDev } = publicRuntimeConfig;
const { PORT } = serverRuntimeConfig;
// 判断开发环境和生产环境
const dev = isDev;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.all("*", (req, res) => {
    return handle(req, res);
  });
  server.get("/", (req, res) => {
    return app.render(req, res, "/index");
  });
  const robotsOptions = {
    root: __dirname + "/public/",
    headers: {
      "Content-Type": "text/plain;charset=UTF-8",
    },
  };
  server.get("/robots.txt", (req, res) =>
    res.status(200).sendFile("robots.txt", robotsOptions)
  );

  const sitemapOptions = {
    root: __dirname + "/public/",
    headers: {
      "Content-Type": "text/xml;charset=UTF-8",
    },
  };
  server.get("/sitemap.xml", (req, res) =>
    res.status(200).sendFile("sitemap.xml", sitemapOptions)
  );

  const faviconOptions = {
    root: __dirname + "/public/",
  };
  server.get("/favicon.ico", (req, res) =>
    res.status(200).sendFile("favicon.ico", faviconOptions)
  );

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
