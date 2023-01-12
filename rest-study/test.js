var mysql      = require('mysql');
var connection = mysql.createConnection({
  host : 'localhost',
  user : 'abc',
  port : '33306',
  password : '1234',
  database : 'node'
});

connection.connect();

var post  = { m_tel: '010-1234-5678', m_id: 'GilDong', m_pass: 'password1', m_name: '홍길동', m_date: '2000-01-01', m_gender: '남', m_email: 'GilDong@Hong.com' };
var query = connection.query('INSERT INTO member SET ?', post, function(err, result) {
  console.log(result);
});

connection.end();
