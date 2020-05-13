var express = require("express");
var path = require("path");
var fs = require("fs");

var app = express();
var PORT = 3000;

// data parsing through express app
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// routes

// returns the index.html file
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});
// returns the notes.html file
app.get("//notes", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});
// return all saved notes in db.json
app.get("/api/notes", function(req, res) {
    // returns the contents of the db.json file
    fs.readFile("./db/db.json", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        var notes = JSON.parse(data);
    });
   return res.json(notes);
});
app.post("/api/notes", function(req, res) {
    // receive new note to save on the request body
    var newNote = req.body;
    // determine unique id for entry
    // add new note to db.json file
    // return new note to client
});
app.delete("/api/notes/:id", function(req, res) {
    // receive query parameter containing id of note to delete
    var id = req.params.id;
    // read notes in db.json file
    fs.readFile("./db/db.json", "utf8", function(error, data) {
        if(error) {
            return console.log(error);
        }
        var notes = JSON.parse(data);
    });
    // remove note with given id
    if (notes.id) {
        delete notes.id;
    }
    // rewrite notes to db.json file
    fs.writeFile("./db/db.json", notes, function(err) {
        if (err) {
            return console.log(err);
        }
    });
});

// start server
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
