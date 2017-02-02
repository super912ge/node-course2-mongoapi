//var mongoose = require('mongoose');
var env = process.env.NODE_ENV || 'development';
console.log('env*********',env);
if(env==='development'){
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';

}else if(env==='test'){
  console.log('****enter test mode****');
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}
var express = require('express');
var bodyParser = require('body-parser');
const _ = require('lodash');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {ObjectID} = require('mongodb');
const port = process.env.PORT || 3000;
var app = new express();
var {authenticate} = require('./middleware/authenticate');

console.log('MONGODB_URI****',process.env.MONGODB_URI);
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
app.delete('/todos/:id',(req,res)=>{
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(400).send();
  }
  Todo.findByIdAndRemove(id).then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e)=>{
    res.status(400).send();
  });
});
app.patch('/todos/:id',(req,res)=>{
  var id = req.params.id;
  var body = _.pick(req.body,['text','completed']);
  if(!ObjectID.isValid(id)){
    return res.status(400).send();
  }
  if(_.isBoolean(body.completed)&&body.completed){
    body.completedAt = new Date().getTime();
  }else {
    body.completed = false;
    body.completedAt = null;
  }
  Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((todo)=>{
    if(!todo){
      return res.status(404).send({message:" id not found"});
    }
    res.send({todo});
  }).catch((e)=>{
    res.status(400).send();
  })
})
app.post('/users',(req,res)=>{
  var body = _.pick(req.body,['email','password']);
  var user = new User(body);
  user.save().then(()=>{
    console.log(user);
   return user.generateAuthToken();
  }).then((token)=>{
    res.header('x-auth').send(user);
  }).catch((e)=>{
    res.status(400).send(e);
  })
});

app.get('/users/me',authenticate, (req,res)=>{
  res.send(req.user);
})
app.listen(port, ()=>{
  console.log('started on port 3000');
})
module.exports = {app};
