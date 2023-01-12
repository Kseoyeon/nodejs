var Client = require("node-rest-client").Client;
var client = new Client();

// content-type header �� jsonŸ������ ����.
var args = {
  data: { port_num: 1000, state: 0, stop_num: 3 },
  headers: { "Content-Type": "application/json" },
};

client.post("http://localhost:3000/ship", args, function (data, response) {
  // js object
  console.log(data);
  //console.log(response);
});
