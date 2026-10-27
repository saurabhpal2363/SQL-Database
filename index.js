const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password: 'mysql@987'
});

let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password()
  ];
}

// let q = "INSERT INTO user (id, username, email, password) VALUES ?";
// let users = [];
// for(let i=1; i<=100; i++) {
//     users.push(getRandomUser());
// };

// try {
//   connection.query(q, [users], (err, res) => {
//     if(err) throw err;
//     console.log(res);
//   });
// } catch(err) {
//   console.log(err);
// }

// connection.end();


app.get("/", (req, res) => {
  let q = `SELECT count(*) FROM user`;
  try {
    connection.query(q, (err, result) => {
      if(err) throw err;
      let count = result[0]["count(*)"];
      res.render("home.ejs", {count});
    })
  } catch(err) {
    res.send(err);
  }
});

app.get("/users", (req, res) => {
  let q = `SELECT * FROM user`;
  try {
    connection.query(q, (err, users) => {
      if(err) throw err;
      res.render("showUsers.ejs", {users});
    })
  } catch(err) {
    res.send(err);
  }
});

app.get("/users/:id/edit", (req, res) => {
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;

  try {
    connection.query(q, (err, result) => {
      if(err) throw err;
      let user = result[0];
      res.render("edit.ejs", {user});
    });
  } catch(err) {
    res.send(err);
  };
});

app.patch("/user/:id", (req, res) => {
  let {id} = req.params;
  let {password: formPass, username: newUsername} = req.body;
  let q = `SELECT * FROM user WHERE id = '${id}'`;

  try {
    connection.query(q, (err, result) => {
      if(err) throw err;
      let user = result[0];
      if(formPass != user.password) {
        res.send("Incorrect Password");
      } else {
        let q2 = `UPDATE user SET username = '${newUsername}' WHERE id = '${id}'`;
        try {
          connection.query(q2, (err, result) => {
            if(err) throw err;
            res.redirect("/users");
          });
        } catch(err) {
          res.send(err);
        };
      }
    });
  } catch(err) {
    res.send(err);
  };
});

app.listen("8080", () => {
  console.log("Serever successfully running at port 8080");
});