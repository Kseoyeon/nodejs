var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "abc",
  port: "3306",
  password: "seoyeon",
  database: "ccit",
});

connection.connect();

var title = { title: "www" };
var post = { dust1: "20", dust2: "10", temp: "31", hum: "30", speed: "0" };
var query = connection.query(
  "INSERT INTO board SET ?",
  post,
  function (err, result) {
    if (err) throw err;
    console.log(result);
  }
);
connection.end();
