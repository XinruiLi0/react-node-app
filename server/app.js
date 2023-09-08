// app.js
const path = require('path');
const express = require("express");
const body_parse = require("body-parser");
const cookie_parser = require("cookie-parser");
const app = express();

const port = process.env.PORT || 3001;

// app.use(body_parse.json());
// app.use(cookie_parser());
// app.use(express.static(__dirname + "/public"));
// app.use(express.urlencoded({ extended: true }));

// Routes
// The path shouldn't be only "/", the front end need to be refactored before setting correct path 
app.use("/", require("./controllers/index"));
app.use("/", require("./controllers/users")); // Should be "/users"
app.use("/", require("./controllers/diagnostic")); // Should be "/diagnostic"
app.use("/", require("./controllers/specialities")); // Should be "/specialities"
app.use("/", require("./controllers/services")); // Should be "/services"
app.use("/", require("./controllers/labtest")); // Should be "/labtest"


app.use(body_parse.json());
app.use(body_parse.urlencoded({ extended: true }));

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});

// user: "uottawabiomedicalsystems@gmail.com", //
// pass: "@uOttawa5902",

app.listen(port, () => console.log(`Server running on the port : ${port}`));
