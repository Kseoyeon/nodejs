var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var config = require("./config"); // config.js
var app = express();

// bodyParser는 미들웨어이기 때문에 라우터 보다 항상 위에 있도록 해야함
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// Mysql DB pool 생성
var pool = mysql.createPool({
            // config.js에 있는 정보를 바탕으로 연결
            host: config.mysql.host,
            port: config.mysql.port,
            user: config.mysql.username,
            password: config.mysql.password,
            database: config.mysql.db,
            connectionLimit:20,
            waitForConnections:false
        });

// Main
app.listen(config.port, function() {
    console.log("Server listening on port %d", config.port);
});

// Router
// 기본으로 index.js를 찾기 때문에
// require("./routes/index.js")라고 명시해주지 않았음
var routes = require("./routes")(app, pool);
