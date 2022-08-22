const path = require("path");
const fs = require("fs");
const express = require("express");
const homeManifest = require("./dist/home/node/ssr-manifest.json");
const mobileManifest = require("./dist/mobile/node/ssr-manifest.json");

const getAdminReactManifest = (version) => require(`./dist/react-${version}/node/asset-manifest.json`);

const { renderToString } = require("vue/server-renderer");
const { createElement } = require("react");
const { renderToString: renderReactToString  } = require('react-dom/server');
const homePath = path.join(
  __dirname,
  "./dist/home",
  "node",
  homeManifest["index.js"]
);
const createHomeApp = require(homePath).default;

const getReactPath = (version) => path.join(
  __dirname,
  `./dist/react-${version}`,
  "node",
    getAdminReactManifest(version)["files"]["main.js"]
);
const createReactApp = (version) => {
  const reactPath =getReactPath(version)
  return require(reactPath).default;
}

const mobilePath = path.join(
  __dirname,
  "./dist/mobile",
  "node",
  mobileManifest["index.js"]
);
const createMobileApp = require(mobilePath).default;

const app = express();

app.use(
  "/home-assets",
  express.static(path.join(__dirname, "./dist/home/client", "home-assets"))
);

app.use(
  "/mobile-assets",
  express.static(path.join(__dirname, "./dist/mobile/client", "mobile-assets"))
);

app.use(
  "/static",
  express.static(path.join(__dirname, "./dist/react-17/client", "static")),
  express.static(path.join(__dirname, "./dist/react-18/client", "static")),
);

const getReactTemplate = (version) => fs.readFileSync(
  path.join(__dirname, `./dist/react-${version}/client/index.html`),
  "utf-8"
);

const homeTemplate = fs.readFileSync(
  path.join(__dirname, "./dist/home/client/index.html"),
  "utf-8"
);

const mobileTemplate = fs.readFileSync(
  path.join(__dirname, "./dist/mobile/client/index.html"),
  "utf-8"
);

app.get("/", async (req, res) => {
  const { app } = createHomeApp();

  const appContent = await renderToString(app);

  const html = homeTemplate
    .toString()
    .replace('<div id="app">', `<div id="app">${appContent}`);

  res.setHeader("Content-Type", "text/html");
  res.send(html);
});

app.get("/mobile/*", async (req, res) => {
  const { app, router } = createMobileApp();

  await router.push(req.url);
  await router.isReady();

  const appContent = await renderToString(app);

  const html = mobileTemplate
    .toString()
    .replace('<div id="app">', `<div id="app">${appContent}`);

  res.setHeader("Content-Type", "text/html");
  res.send(html);
});

app.get("/react-17/*", async (req, res) => {

  const app = createElement(createReactApp(17)(req.url))
  const appContent = renderReactToString(app);
  const html = getReactTemplate(17)
    .toString()
    .replace('<div id="root">', `<div id="root">${appContent}`);

  res.setHeader("Content-Type", "text/html");
  res.send(html);
});

app.get("/react-17", async (req, res, next) => {
  res.status(301).redirect("/react-17/");
  next();
});

app.get("/react-18/*", async (req, res) => {

  const reactApp = createReactApp(18)
  const app = createElement(reactApp(req.url))
  const appContent = renderReactToString(app);
  const html = getReactTemplate(18)
    .toString()
    .replace('<div id="root">', `<div id="root">${appContent}`);

  res.setHeader("Content-Type", "text/html");
  res.send(html);
});

app.get("/react-18", async (req, res, next) => {
  res.status(301).redirect("/react-18/");
  next();
});

app.get("/mobile", async (req, res, next) => {
  res.status(301).redirect("/mobile/");
  next();
});

app.listen(3000);
