var async = require("async");
var mysql = require("mysql");
var fs = require("fs");

module.exports = function(app, pool) {

    app.post("/ship", function(req, res) {
        var result = {};
        var port_num = null;
        var state = null;
        var stop_num = null;
        async.waterfall([
          function(callback) {
            port_num = mysql.escape(req.body.port_num);
            state = mysql.escape(req.body.state);
            stop_num = mysql.escape(req.body.stop_num);
            callback();
          },
          function(callback) {
            if (port_num == undefined) {
              callback(new Error("Port_num is empty."));
            } else if (state == undefined) {
              callback(new Error("State is empty."));
            } else if (stop_num == undefined) {
              callback(new Error("Stop_num is empty."));
            } else {
                // db�� �����Ͽ� sql ����
                pool.getConnection(function(err, conn) {
                    // title ������ DB�� �ֱ� ���� SQL�� �غ�
                  var sql = "INSERT INTO ship (port_num, state, stop_num) VALUES (" + port_num + "," + state +  "," + stop_num + ");";
                  console.log("SQL: " + sql);
                  conn.query(sql, function(err) {
                    if (err) {
                    // err�� ���� conn�� release() �� ���־����Ѵ�.
                      conn.release();
                      callback(err);
                    } else {
                      conn.release();
                      callback();
                      }
                  });
                });
              }
          }],
          function(err) {
            result = returnResult(err, res)
            result.status = res.statusCode;
            res.send(result);
          });
    });

    app.post("/login", function(req, res) {
        var result = {};
        var name = null;
        var birth = null;
        var user_id = null;
        var password = null;
        async.waterfall([
          function(callback) {
            name = mysql.escape(req.body.name);
      	    birth = mysql.escape(req.body.birth);
            user_id = mysql.escape(req.body.user_id);
            password = mysql.escape(req.body.password);
            callback();
          },
          function(callback) {
            if (name == undefined) {
              callback(new Error("Name is empty."));
	          } else if (birth == undefined) {
		          callback(new Error("Birth is empty."));
            } else if (user_id == undefined) {
		          callback(new Error("ID is empty."));
            } else if (password == undefined) {
		          callback(new Error("Password is empty."));
            } else {
                // db�� �����Ͽ� sql ����
                pool.getConnection(function(err, conn) {
                    // title ������ DB�� �ֱ� ���� SQL�� �غ�
                  var sql = "INSERT INTO users (name, birth, user_id, password) VALUES (" + name + "," + birth + ","+ user_id +"," + password + ");";
                  console.log("SQL: " + sql);
                  conn.query(sql, function(err) {
                    if (err) {
                    // err�� ���� conn�� release() �� ���־����Ѵ�.
                      conn.release();
                      callback(err);
                    } else {
                      conn.release();
                      callback();
                      }
                  });
                });
              }
          }],
          function(err) {
            result = returnResult(err, res)
            result.status = res.statusCode;
            res.send(result);
          });
    });

    app.get("/port", function(req, res) {
        var result = {};
        // db�� �����Ͽ� sql ����
        pool.getConnection(function(err, conn) {
            var sql = "SELECT port_num, state, stop_num from ship where(port_num, date) in (select port_num, max(date) from ship group by port_num) ORDER BY port_num asc;";
      //console.log("SQL: " + sql);
            conn.query(sql, function(err, rows) {
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

    app.get("/ports/:num", function(req, res) {
        var result = {};
        var num = req.params.num;
        // db�� �����Ͽ� sql ����
        pool.getConnection(function(err, conn) {
            var sql = "SELECT port_num, date_format(date, '%Y-%m-%d %H:%m:%s') as date, state, stop_num from ship where port_num = "+num+";";
      //console.log("SQL: " + sql);
            conn.query(sql, function(err, rows) {
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

    app.get("/members", function(req, res) {
        var result = {};
        // db�� �����Ͽ� sql ����
        pool.getConnection(function(err, conn) {
            var sql = "SELECT name, birth, user_id, password from users;";
	    //console.log("SQL: " + sql);
            conn.query(sql, function(err, rows) {
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

    app.get("/test", function(req, res) {
        var result = {};
        // db�� �����Ͽ� sql ����
        pool.getConnection(function(err, conn) {
            var sql = "SELECT name, birth, id, password from users;";
      //console.log("SQL: " + sql);
            conn.query(sql, function(err, rows) {
                var result = returnResult(err, res);
                if (rows) {
                    result.people = rows;
                }
                conn.release();
                //result.status = res.statusCode;
                res.send(result);
            });
        });
    });

    app.get("/schedule_check", function(req, res) {
        var result = {};
        // db�� �����Ͽ� sql ����
        pool.getConnection(function(err, conn) {
            var sql = "SELECT date_format(date, '%Y-%m-%d'), contents from schedule;";
	    //console.log("SQL: " + sql);
            conn.query(sql, function(err, rows) {
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

    app.get("/led", function(req, res) {
        var result = {};
        // db�� �����Ͽ� sql ����
        pool.getConnection(function(err, conn) {
            var sql = "SELECT (SELECT case when id = 1 then on_off ELSE '' END from led where id = 1)sea1, (SELECT case when id = 2 then on_off ELSE '' END from led where id = 2)sea2, (SELECT case when id = 3 then on_off ELSE '' END from led where id = 3)sea3, (SELECT case when id = 4 then on_off ELSE '' END from led where id = 4)sea4, (SELECT case when id = 5 then on_off ELSE '' END from led where id = 5)sea5 FROM dual;";
            conn.query(sql, function(err, rows) {
                var result = returnResult(err, res);
                if (rows) {
                    result = rows;
                }
                conn.release();
                res.send(result);
            });
        });
    });

    app.put("/onoff", function(req, res) {
        var result = {};
      	var sea1 = null;
      	var sea2 = null;
        var sea3 = null;
        var sea4 = null;
        var sea5 = null;
        async.waterfall([
        function(callback) {
	         sea1 = mysql.escape(req.body.sea1);
           sea2 = mysql.escape(req.body.sea2);
           sea3 = mysql.escape(req.body.sea3);
           sea4 = mysql.escape(req.body.sea4);
           sea5 = mysql.escape(req.body.sea5);
            callback();
        },
        function(callback) {
	         if (sea1 == undefined) {
                callback(new Error("Sea1 is empty."));
            } else if (sea2 == undefined) {
                callback(new Error("Sea2 is empty."));
            } else if (sea3 == undefined) {
                callback(new Error("Sea3 is empty."));
            } else if (sea4 == undefined) {
                callback(new Error("Sea4 is empty."));
            } else if (sea5 == undefined) {
                callback(new Error("Sea5 is empty."));
            } else {
                // db�� �����Ͽ� sql ����
                pool.getConnection(function(err, conn) {
                    // title ������ ������Ʈ �ϱ� ���� SQL
                    var sql = "UPDATE led SET on_off = CASE WHEN id = 1 THEN "+ sea1 +" WHEN id = 2 THEN "+ sea2 +" WHEN id = 3 THEN "+ sea3 +" WHEN id = 4 THEN "+ sea4 +" WHEN id = 5 THEN "+ sea5 +" END WHERE id IN(1,2,3,4,5);";
                    console.log("SQL: " + sql);
                    conn.query(sql, function(err) {
                        if (err) {
                            // err�� ���� conn�� release() �� ���־����Ѵ�.
                            conn.release();
                            callback(err);
                        } else {
                            conn.release();
                            callback();
                        }
                    });
                });
            }
        }],
        function(err) {
            result = returnResult(err, res)
            res.send(result);
        });
    });
    app.put("/onoff2", function(req, res) {
        var result = {};
      	var id = null;
      	var on_off = null;
        async.waterfall([
          function(callback) {
            id = mysql.escape(req.body.id);
            on_off = mysql.escape(req.body.on_off);
            callback();
        },
          function(callback) {
                // db�� �����Ͽ� sql ����
                pool.getConnection(function(err, conn) {
                    // title ������ ������Ʈ �ϱ� ���� SQL
                    var sql = "UPDATE led SET on_off = " + on_off + " WHERE id = " + id + " ;";
                    console.log("SQL: " + sql);
                    conn.query(sql, function(err) {
                        if (err) {
                            // err�� ���� conn�� release() �� ���־����Ѵ�.
                            conn.release();
                            callback(err);
                        } else {
                            conn.release();
                            callback();
                        }
                    });
                });

          }],
          function(err) {
            result = returnResult(err, res)
            res.send(result);
        });
    });
    app.put("/webcontrol/:id/:speed", function(req, res) {
        var result = {};
      	var id = req.params.id;
      	var speed = req.params.speed;
        async.waterfall([
          function(callback) {
	    //speed = mysql.escape(req.body.speed);
            callback();
        },
          function(callback) {
                // db�� �����Ͽ� sql ����
                pool.getConnection(function(err, conn) {
                    // title ������ ������Ʈ �ϱ� ���� SQL
                    var sql = "UPDATE board" +id+ " SET speed=" + speed +" order by num desc limit 1;";
                    console.log("SQL: " + sql);
                    conn.query(sql, function(err) {
                        if (err) {
                            // err�� ���� conn�� release() �� ���־����Ѵ�.
                            conn.release();
                            callback(err);
                        } else {
                            conn.release();
                            callback();
                        }
                    });
                });

          }],
          function(err) {
            result = returnResult(err, res)
            res.send(result);
        });
    });
}


var returnResult = function(err, res) {
    // ������ ������ ���� �����ϱ� ���� result ��ü ����
    var result = {};
    if (err) {
        res.status(400);
        result.message = err.stack;
    } else {
        res.status(200);
        result.message = "Success";
    }
    return result;
}
