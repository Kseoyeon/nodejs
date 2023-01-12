var Client = require("node-rest-client").Client;
var client = new Client();

client.get("http://localhost:3000/port", function (data, response) {
  // parsed response body as js object
  console.log(data);
  for (i = 0; i < data.length; i++) {
    console.log(data[i].port_num);
    console.log(data[i].state);
    console.log(data[i].stop_num);
  }
  // raw response
  //console.log(response);
});
