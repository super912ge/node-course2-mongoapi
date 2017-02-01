//var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {ObjectID} = require('mongodb');

var app = new express();

app.use(bodyParser.json());
app.post('/todos',(req,res)=>{
  var todo = new Todo({
    text:req.body.text
  });
  console.log(req.body);
  todo.save().then((doc)=>{
    res.send(doc);
  },(e)=>{
    res.status(400).send(e);
  })

});

app.get('/todos',(req,res)=>{
  Todo.find().then((todos)=>{
    res.send({todos});
  },(e)=>{
    res.status.send(e);
  });
});
// GET /todo/12345
app.get('/todos/:id',(req,res)=>{
  var id = req.params.id;
  //res.send(req.params);
  if(!ObjectID.isValid(id)){
   return res.status(400).send({
     message:"id not valid",
     id: id
   }).end();
  };
  Todo.findById(id).then((todo)=>{
    if(!todo){
      res.status(404).send({message:"not found"}).end();
    }
    res.send({todo});
  }).catch((e)=>{
    return res.status(400).send({
      message:"id not valid",
      id:id
  }).end();
  })
});
app.listen(3000, ()=>{
  console.log('started on port 3000');
})
module.exports = {app};
