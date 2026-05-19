const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./mydata.db");

db.run(
  `CREATE TABLE IF NOT EXISTS Employee (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fname TEXT NOT NULL,
    lname TEXT NOT NULL
  )`
);

app.get("/employee", (req, res) => {
  db.all("SELECT * FROM Employee", (err, rows) => {
    if (err) {
      res.status(500).json(err);
      return;
    }
    res.json(rows);
  });
});

app.post("/employee", (req, res) => {
  const { fname, lname } = req.body;
  db.run(
    `INSERT INTO Employee (fname, lname) VALUES (?, ?)`,
    [fname, lname],
    (err) => {
      if (err) {
        res.status(500).json(err);
        return;
      }
      res.json({
        message: "success",
      });
    }
  );
});

app.delete("/employee/:id", (req, res) => {
  const { id } = req.params;
  db.run(
    `DELETE FROM Employee WHERE id = ?`,
    [id],
    (err) => {
      if (err) {
        res.status(500).json(err);
        return;
      }

      res.json({
        message: "deleted",
      });
    }
  );
});

app.listen(8080, () => {
  console.log("Backend starting at 8080.");
});
