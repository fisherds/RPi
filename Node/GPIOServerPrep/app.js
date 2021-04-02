const express = require("express");

const app = express();

app.get("/hello", function (req, res) {
  console.log("Called Hello Node");
  res.json({
    status: "ok",
    message: "hello Dave Fisher"
  });
});

app.listen(3000);