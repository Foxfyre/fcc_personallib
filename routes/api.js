/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

const CONNECTION_STRING = process.env.DATABASE;

MongoClient.connect(CONNECTION_STRING, (err, db) => {
  if (err) console.log("Database error: " + err);
  else console.log("Successful database connection");
});
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
        MongoClient.connect(process.env.DATABASE, (err, db) => {
          const collection = db.collection("books");
          
          collection.find().toArray((err, result) => {
            res.json(result);
          })
        })
    })
    
    .post(function (req, res){
      var title = req.body.title;
    
      if (title === "") {
        res.json({entry: "Failed, title required"});
        return;
      }
      MongoClient.connect(process.env.DATABASE, (err, db) => {
        const collection = db.collection("books");
        
        collection.findOne({title: title}, (err, book) => {
          if (book == null) {
             collection.insert({
               title: title,
               comments: [],
               commentcount: 0
             }, (err, result) => {
               res.json({title: result.ops[0].title, _id: result.ops[0]._id });
             })
          } else {
            res.json({title: "Failed, book exists", _id: "", comments: []});
          }
        })
      });
    })
    
    .delete(function(req, res){
      MongoClient.connect(process.env.DATABASE, (err, db) => {
        const collection = db.collection("books");
        
        collection.deleteMany({}, (err,result) => {
          res.send("complete delete successful");
        })
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
    
      if (bookid === "") {
        res.json({entry: "Failed, title required"});
        return;
      } else if (bookid.length > 24) {
        res.send("no book exists");
        return;
      }
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      MongoClient.connect(process.env.DATABASE, (err, db) => {
          const collection = db.collection("books");
          
          collection.find({_id: ObjectId(bookid)}).toArray((err, result) => {
            if (result.length !== 0) {
            res.json({
              _id: result[0]._id,
              title: result[0].title,
              comments: result[0].comments
            })
            } else {
              res.send("no book exists");
            }
        })
    })
  })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      MongoClient.connect(process.env.DATABASE, (err, db) => {
          const collection = db.collection("books");
          
          collection.findOneAndUpdate({_id: new ObjectId(bookid)},{$push: {comments: comment}, $inc: {commentcount: 1}}, (err, result) => {})
        
          collection.find({_id: new ObjectId(bookid)}).toArray((err, result) => {
              res.json({
                _id: result[0]._id,
                title: result[0].title,
                comments: result[0].comments,
                commentcount: result[0].commentcount
              })
          })
      })
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
        MongoClient.connect(process.env.DATABASE, (err, db) => {
          const collection = db.collection("books");
        
          collection.deleteOne({_id: bookid}, (err,result) => {
            console.log(result);
            res.send("delete successful");
          })
        });
    });
  
};
