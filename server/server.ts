import "dotenv/config";
import express, { Router } from "express";
import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("db.sqlite3");

const PORT = process.env.PORT || 5050;
const app = express();

const apiRouter = Router();
apiRouter.get("/", async (_, res) => {
  const query = db.prepare(
    "SELECT id, tvdb_id, complete, last_mod, ignore, justification FROM landahoy;"
  );
  const rows = query.all();
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  if (rows.length) {
    res.send(rows);
  } else {
    res.send("No results found!");
  }
  res.end();
});
const apiURL = process.env.SONARR_URL + "/api/v3";
apiRouter.get("/import", async (_, res) => {
  const sonarrResponse = await fetch(apiURL + "/series", {
    headers: [["X-Api-Key", process.env.SONARR_TOKEN as string]],
  });
  const sonarrResponseData: Series[] = await sonarrResponse.json();
  const incompleteSeries = sonarrResponseData.filter(
    (series) => series.statistics.percentOfEpisodes < 100
  );
  const time = Date.now();
  const query = db.prepare(
    "INSERT OR IGNORE INTO landahoy (tvdb_id, complete, last_mod, ignore) VALUES (?, false, ?, false);"
  );
  for (const series of incompleteSeries) {
    query.run(series.tvdbId, time);
  }
  res.contentType("application/json");
  res.end(JSON.stringify([sonarrResponseData, incompleteSeries]));
});

const uiRouter = Router();
uiRouter.get("/", async (_, res) => {
  res.end();
});

app.use("/api", apiRouter);
app.use("/", uiRouter);
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

interface Series {
  tvdbId: number;
  statistics: {
    percentOfEpisodes: number;
  };
}
