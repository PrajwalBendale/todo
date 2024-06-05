const mysql = require("mysql2");
const express = require("express");
const cors = require("cors");
const config = require("config");
//const todolistRoutes=require("./routes/todo");

const app = express();

app.use(express.json());
app.use(cors());

//app.use('/todos',todolistRoutes);
app.listen(9999, () => {
  console.log("Server Started...");
});

const connectionDetails = {
  host: config.get("host"),
  database: config.get("database"),
  user: config.get("user"),
  password: config.get("password"),
};

app.get("/tasks", (req, res) => {
  var sql = "select * from tasks";
  var connection = mysql.createConnection(connectionDetails);

  connection.query(sql, (err, results) => {
    if (err) {
      let reply = {
        result: err,
        message: "error",
      };
      return res.status(500).json({ reply }), connection.end(), res.end();
    }
    let reply = {
      result: results,
      message: "success",
    };
    res.status(200).json({ reply }), connection.end(), res.end();
  });
});

app.post("/tasks", (req, res) => {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Task title is required" });
  }

  var sql = "INSERT INTO tasks (title, description) VALUES (?, ?)";
  var connection = mysql.createConnection(connectionDetails);
  connection.query(sql, [title, description], (err, results) => {
    if (err) {
      let reply = {
        result: err,
        message: "error",
      };
      return res.status(500).json({ reply }), connection.end(), res.end();
    }
    let reply = {
      result: results,
      message: "success",
    };
    res.status(200).json({ reply }), connection.end(), res.end();
  });
});
