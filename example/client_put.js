var Client = require("node-rest-client").Client;
var client = new Client();

// content-type header �� jsonŸ������ ����.
var args = {
  data: { sea1: 1, sea2: 0, sea3: 1, sea4: 0, sea5: 0 },
  headers: { "Content-Type": "application/json" },
};

client.put("http://localhost:3000/onoff", args, function (data, response) {
  // js object
  console.log(data);
  //console.log(response);
});
