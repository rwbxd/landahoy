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
    if (result.rowCount) {
        res.send(result.rows);
    } else {
        res.send("Didn't find any results");
    }
    res.end();
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})