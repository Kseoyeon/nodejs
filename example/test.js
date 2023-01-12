var async = require("async");
var mysql = require("mysql");

module.exports = function (app, pool) {
  // >> Index page
  app.get("/", function (req, res) {
    res.redirect("/list");
  });

  app.get("/list", function (req, res) {
    var result = {};
    pool.getConnection(function (err, conn) {
      var sql =
        "SELECT temp, hum, on_off, dust from table order by id desc limit 1";
      conn.query(sql, function (err, rows) {
        var result = returnResult(err, res);
        if (rows) {
          result.message = rows;
        }
        conn.release();
        result.status = res.statusCode;
        res.send(result);
      });
    });
  });
};
