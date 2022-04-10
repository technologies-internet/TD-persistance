var bodyParser = require("body-parser"),
    express = require("express"),
    app = express();

var letters = {};


app.use( express.static("public") );

app.get("/getLetters", (req,res) => res.json( Object.values( letters ) ));

app.post("/addLetter", bodyParser.text(), (req,res) => {
  letters[req.body] = req.body;
  res.end();
} );

app.listen(3333);
