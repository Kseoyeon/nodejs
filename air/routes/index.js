var async = require("async");
var mysql = require("mysql");
var fs = require("fs");

module.exports = function (app, pool) {
  app.post("/:id", function (req, res) {
    var result = {};
    var dust1 = null;
    var dust2 = null;
    var temp = null;
    var hum = null;
    var speed = null;
    var id = req.params.id;
    async.waterfall(
      [
        function (callback) {
          dust1 = mysql.escape(req.body.dust1);
          dust2 = mysql.escape(req.body.dust2);
          temp = mysql.escape(req.body.temp);
          hum = mysql.escape(req.body.hum);
          speed = mysql.escape(req.body.speed);
          callback();
        },
        function (callback) {
          if (dust1 == undefined) {
            callback(new Error("Dust1 is empty."));
          } else if (dust2 == undefined) {
            callback(new Error("Dust2 is empty."));
          } else if (temp == undefined) {
            callback(new Error("Temp is empty."));
          } else if (hum == undefined) {
            callback(new Error("Hum is empty."));
          } else if (speed == undefined) {
            callback(new Error("Speed is empty."));
          } else {
            pool.getConnection(function (err, conn) {
              var sql =
                "INSERT INTO board" +
                id +
                " (dust1, dust2, temp, hum, speed) VALUES (" +
                dust1 +
                "," +
                dust2 +
                "," +
                temp +
                "," +
                hum +
                "," +
                speed +
                ");";
              console.log("SQL: " + sql);
              conn.query(sql, function (err) {
                if (err) {
                  conn.release();
                  callback(err);
                } else {
                  conn.release();
                  callback();
                }
              });
            });
          }
        },
      ],
      function (err) {
        result = returnResult(err, res);
        result.status = res.statusCode;
        res.send(result);
      }
    );
  });

  app.get("/list/:id", function (req, res) {
    var result = {};
    var id = req.params.id;
    pool.getConnection(function (err, conn) {
      var sql =
        "SELECT dust1, dust2, temp, hum, date_format(date, '%Y-%m-%d %H:%m:%s') as date, speed from board" +
        id +
        " order by num desc limit 1;";
      //console.log("SQL: " + sql);
      conn.query(sql, function (err, rows) {
        var result = returnResult(err, res);
        if (rows) {
          result = rows;
        }
        conn.release();
        //result.status = res.statusCode;
        res.send(result);
      });
    });
  });

  app.get("/speed/:id", function (req, res) {
    var result = {};
    var id = req.params.id;
    pool.getConnection(function (err, conn) {
      var sql = "SELECT speed from board" + id + " order by num desc limit 1;";
      conn.query(sql, function (err, rows) {
        var result = returnResult(err, res);
        if (rows) {
          result = rows;
        }
        conn.release();
        res.send(result);
      });
    });
  });

  app.put("/control/:id", function (req, res) {
    var result = {};
    var id = req.params.id;
    var speed = null;
    async.waterfall(
      [
        function (callback) {
          speed = mysql.escape(req.body.speed);
          callback();
        },
        function (callback) {
          if (speed == undefined) {
            callback(new Error("speed is empty."));
          } else {
            pool.getConnection(function (err, conn) {
              var sql =
                "UPDATE board" +
                id +
                " SET speed=" +
                speed +
                " order by num desc limit 1;";
              console.log("SQL: " + sql);
              conn.query(sql, function (err) {
                if (err) {
                  conn.release();
                  callback(err);
                } else {
                  conn.release();
                  callback();
                }
              });
            });
          }
        },
      ],
      function (err) {
        result = returnResult(err, res);
        res.send(result);
      }
    );
  });
  app.put("/webcontrol/:id/:speed", function (req, res) {
    var result = {};
    var id = req.params.id;
    var speed = req.params.speed;
    async.waterfall(
      [
        function (callback) {
          //speed = mysql.escape(req.body.speed);
          callback();
        },
        function (callback) {
          pool.getConnection(function (err, conn) {
            var sql =
              "UPDATE board" +
              id +
              " SET speed=" +
              speed +
              " order by num desc limit 1;";
            console.log("SQL: " + sql);
            conn.query(sql, function (err) {
              if (err) {
                conn.release();
                callback(err);
              } else {
                conn.release();
                callback();
              }
            });
          });
        },
      ],
      function (err) {
        result = returnResult(err, res);
        res.send(result);
      }
    );
  });
};

var returnResult = function (err, res) {
  var result = {};
  if (err) {
    res.status(400);
    result.message = err.stack;
  } else {
    res.status(200);
    result.message = "Success";
  }
  return result;
};
