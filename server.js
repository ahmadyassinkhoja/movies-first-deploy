const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const PORT= 3000

const http = require('http')
const path = require('path');


app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/dist/movies-project/index.html'));
});

const port =  3000;
app.set('port', port);


// mongo db
var mongodb = require("mongodb"); 

// getting id
var ObjectID = mongodb.ObjectID;

let db;

Posts = "posts"


// const mongoUrl = 'mongodb://<dbuser>:<dbpassword>@ds145463.mlab.com:45463/movies'
const mongoUrl = 'mongodb://ahmadyassin:12345ahmad@ds145463.mlab.com:45463/movies'

// let Movies

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(mongoUrl, function (err, database) {
    if (err) {
      console.log(err);
    }

    // Save database object from the callback for reuse.
    db = database.db('movies');
    // Movies = db.collection('movies')
    console.log("Database connection ready");

    var server = app.listen(PORT, function () {
        console.log("App now running on port", PORT);
    });

})

  // for parsing and delevering the json
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}) );

  // for google auth and allowing passing headers from server to app
  app.all("/*", function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
  });


  
app.get('/', (req, res) => {
    res.send({
        msg: 'Welcome to Movies Backend'
    })
})

app.get('/movies', (req, res) => {
    let movies = db.collection("movies").find({}).toArray((err, doc) => res.send(doc))
})
app.get('/getMovie/:id', (req, res) => {
    const movie = db.collection("movies").find( { _id: ObjectID(req.params.id) } ).toArray((err, doc) => res.send(doc[0]))
})

app.post('/addMovie', (req, res) => {
    db.collection("movies").insertOne(req.body, function(err, result) {
        if (err) {
          console.log(err)
        } else {
          console.log(result)
        }
    });
})

app.put('/updateMovie/:id', (req, res) => {
    console.log(req.body)
    let myQuery =  { _id: ObjectID(req.params.id) }

    let movie = {
        "name": req.body.name,
        "genre": req.body.genre,
        "length": req.body.length,
    }

    let newValue = {$set: req.body}
    db.collection("movies").findOneAndUpdate( myQuery, {$set: movie} )
})

app.delete('/deleteMovie/:id', (req, res) => {
    const movie = db.collection("movies").remove( { _id: ObjectID(req.params.id) } )
})