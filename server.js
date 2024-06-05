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

app.put("/tasks/:id", (req, res) => {
  // console.log(req.params);
  const { id } = req.params;
  const { title, description, status } = req.body;

  var connection = mysql.createConnection(connectionDetails);
  if (status !== undefined) {
    const selectQuery = "SELECT * FROM tasks WHERE id = ?";

    connection.query(selectQuery, [id], (err, results) => {
      if (err) {
        let reply = {
          result: err,
          message: "error",
        };
        return res.status(500).json({ reply }), connection.end(), res.end();
      }
      if (results[0] && results[0].status == true) {
        let reply = {
          result: "Task is already completed",
          message: "success",
        };
        return res.status(400).json({ reply }), connection.end(), res.end();
      }

      const query =
        "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?";
      connection.query(
        query,
        [title, description, status, id],
        (err, results) => {
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
        }
      );
    });
  }
});

app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM tasks WHERE id = ?";
  var connection = mysql.createConnection(connectionDetails);
  connection.query(query, [id], (err, results) => {
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
