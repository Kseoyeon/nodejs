var async = require("async");
var mysql = require("mysql");

module.exports = function(app, pool) {
    // >> Index page
    app.get("/", function(req, res) {
        // GET 메소드 /games로 넘어감
        res.redirect("/games");
    });

    // >> POST
    app.post("/games", function(req, res) {
        var result = {};
        var title = null;
        async.waterfall([
        function(callback) {
            title = mysql.escape(req.body.title);
            callback();
        },
        function(callback) {
            if (title == undefined) {
                callback(new Error("Title is empty."));
            } else {
                // db에 연결하여 sql 수행
                pool.getConnection(function(err, conn) {
                    // title 정보를 DB에 넣기 위한 SQL문 준비
                    var sql = "INSERT INTO myGames (title) VALUES (" + title + ");";
                    console.log("SQL: " + sql);
                    conn.query(sql, function(err) {
                        if (err) {
                            // err가 떠도 conn은 release() 꼭 해주어야한다.
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

    // >> GET
    app.get("/games", function(req, res) {
        var result = {};
        // db에 연결하여 sql 수행
        pool.getConnection(function(err, conn) {
            var sql = "SELECT * from myGames;";
            conn.query(sql, function(err, rows) {
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

    // >> GET/id
    app.get("/games/:id", function(req, res) {
        var result = {};
        // SQL injection attack 방지위해 mysql.escape();
        var id = mysql.escape(req.params.id);

        // db에 연결하여 sql 수행
        pool.getConnection(function(err, conn) {
            var sql = "SELECT * from myGames WHERE id=" + id + ";";
            conn.query(sql, function(err, rows) {
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

    // >> PUT
    app.put("/games/:id", function(req, res) {
        var result = {};
        var id = null;
        var title = null;
        async.waterfall([
        function(callback) {
            id = mysql.escape(parseInt(req.params.id));
            title = mysql.escape(req.body.title);
            callback();
        },
        function(callback) {
            if (id == undefined) {
                callback(new Error("Id is empty."));
            } else if (title == undefined) {
                callback(new Error("Title is empty."));
            } else {
                // db에 연결하여 sql 수행
                pool.getConnection(function(err, conn) {
                    // title 정보를 업데이트 하기 위한 SQL
                    var sql = "UPDATE myGames SET title=" + title + " WHERE id=" + id + ";";
                    console.log("SQL: " + sql);
                    conn.query(sql, function(err) {
                        if (err) {
                            // err가 떠도 conn은 release() 꼭 해주어야한다.
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

    // >> DELETE
    app.delete("/games/:id", function(req, res) {
        var result = {};
        var id = null;

        async.waterfall([
        function(callback) {
            id = mysql.escape(parseInt(req.params.id));
            callback();
        },
        function(callback) {
            if (id == undefined) {
                callback(new Error("Id is empty."));
            } else {
                // db에 연결하여 sql 수행
                pool.getConnection(function(err, conn) {
                    var sql = "DELETE FROM myGames WHERE id=" + id + ";";
                    conn.query(sql, function(err) {
                        if (err) {
                            // err가 떠도 conn은 release() 꼭 해주어야한다.
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
}

var returnResult = function(err, res) {
    // 결과를 눈으로 보기 쉽게하기 위해 result 객체 생성
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
