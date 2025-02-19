import 'dotenv/config';
import express from "express";
import pg from 'pg';
const { Pool } = pg;

const db = new Pool({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    max: 10,
});

const PORT = process.env.PORT || 5050;
const app = express();

app.get('/', async (_, res) => {
    const result = await db.query("SELECT * FROM landahoy;");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    if (result.rowCount) {
        res.send(result.rows);
    } else {
        res.send("Didn't find any results");
    }
    res.end();
})

const apiURL = process.env.SONARR_URL + '/api/v3';
app.get('/import', async (_, res) => {
    console.log(process.env);
    const sonarrResponse = await fetch(apiURL + '/series', {headers: [['X-Api-Key', process.env.SONARR_TOKEN as string]]});
    const sonarrResponseData = await sonarrResponse.json();
    res.contentType('application/json');
    res.end(JSON.stringify(sonarrResponseData));
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})