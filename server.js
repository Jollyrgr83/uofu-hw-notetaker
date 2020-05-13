var express = require("express");
var path = require("path");
var fs = require("fs");

var app = express();
var PORT = 3000;

// data parsing through express app
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// used for stylesheet and js
app.use(express.static(__dirname + '/public'));

// routes

// returns the index.html file
app.get("/", function(req, res) {
    console.log("GET: /");
    res.sendFile(path.join(__dirname, "/public/index.html"));
});
// returns the notes.html file
app.get("/notes", function(req, res) {
    console.log("GET: /notes");
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});
// return all saved notes in db.json
app.get("/api/notes", function(req, res) {
    console.log("GET: /api/notes");
    // returns the contents of the db.json file
    return fs.readFile("./db/db.json", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        var notes = JSON.parse(data);
        return res.json(notes.data);
    });
});
app.post("/api/notes", function(req, res) {
    console.log("POST: /api/notes");
    // receive new note to save on the request body
    var newNote = req.body;
    // determine unique id for entry
    fs.readFile("./db/db.json", "utf8", function(error, data) {
        if(error) {
            return console.log(error);
        }
        var notes = JSON.parse(data);
        var newID = parseInt(notes.index);
        // add new note to db.json file
        newNote.id = newID;
        notes.data.push(newNote);
        notes.index = newNote.id + 1;
        // return new note to client
        fs.writeFile("./db/db.json", JSON.stringify(notes), function(err) {
            if (err) {
                return console.log(err);
            }
        });
    });
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});
app.delete("/api/notes/:id", function(req, res) {
    console.log("DELETE: /api/notes/:id");
    // receive query parameter containing id of note to delete
    var id = parseInt(req.params.id);
    // read notes in db.json file
    fs.readFile("./db/db.json", "utf8", function(error, data) {
        if(error) {
            return console.log(error);
        }
        var notes = JSON.parse(data);
        // remove note with given id
        var newNotes = [];
        for (let i = 0; i < notes.data.length; i++) {
            if (notes.data[i].id != id) {
                newNotes.push(notes.data[i]);
            }
        }
        notes.data = [...newNotes];
        // rewrite notes to db.json file
        fs.writeFile("./db/db.json", JSON.stringify(notes), function(err) {
            if (err) {
                return console.log(err);
            }
        });
    });
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// start server
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
