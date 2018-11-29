/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

let book_id;

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post("/api/books")
        .end(function(err,res){
          assert.equal(res.status, 200);
          assert.property(res.body, "title", "Book should contain title");
          assert.property(res.body, "_id", "Book should contain _id");
          assert.property(res.body, "comments", "Book should contain comments");
          assert.isArray(res.body.comments);
          assert.notEqual(res.body.title, "");
          done();
        })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post("/api/books")
        .end(function(err,res){
          assert.equal(res.status, 200);
          assert.notEqual(res.text, "missing title")
          done();
        })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get("/api/books")
        .end(function(err,res){
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], "_id", "Book should contain _id");
          assert.property(res.body[0], "comments", "Book should contain comments");
          assert.notEqual(res.body.title, "");
          assert.notEqual(res.text, "no book exists");
          done();
        })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .post("/api/books")
        .end(function(err,res){
          assert.equal(res.status, 200)
          assert.notEqual(res.text, "no book exists")
          assert.notEqual(res.body.title, "");
          done();
        })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .post("/api/books")
        .end(function(err,res){
          assert.equal(res.status, 200);
            assert.property(res.body, 'comments', 'Book should contain comments');
            assert.isArray(res.body.comments, 'Comments should be an array');
            assert.property(res.body, 'title', 'Book should contain title');
            assert.property(res.body, '_id', 'Book should contain _id');
            assert.notEqual(res.body._id, book_id);
          done();
        })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post("/api/books")
        .end(function(err,res){
          assert.equal(res.status, 200)
          assert.property(res.body, "title", "Book should contain title");
          assert.property(res.body, "_id", "Book should contain _id");
          assert.property(res.body, "comments", "Book should contain comments");
          assert.isArray(res.body.comments);
          assert.notEqual(res.body.title, "");
          done();
        })
      });
      
    });

  });

});
