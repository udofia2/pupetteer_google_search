import express, { Express } from "express";
import { SearchController } from "./searchController";
import * as path from "path";

const app: Express = express();
const port: number = 3000;
const searchController = new SearchController();

app.use(express.static(path.join(__dirname, "../public")));

app.use(express.json());

app.get("/health", (req, res) => {
  res.send("Server is alive");
});

setInterval(() => {
  fetch(`https://bubble-g4ba.onrender.com//health`).catch(console.error);
}, 14 * 60 * 1000);

app.get("/search/api", (req, res) => searchController.searchWithApi(req, res));
app.get("/search/manual", (req, res) =>
  searchController.searchManual(req, res)
);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
