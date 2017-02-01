const {ObjectID} = require('mongodb');

const{mongoose} = require('./../server/db/mongoose');
const{Todo} = require('./../server/models/todo');

var id = "5891261526dfaf388c3719f8";
if (!ObjectID.isValid(id)) {
  console.log('ID not valid');
}
Todo.find({
  _id: id
}).then((todos)=>{
  console.log('Todos',todos);
})

Todo.findOne({
  _id: id
}).then((todos)=>{
  console.log('Todos',todos);
})
Todo.findById(id).then((todo)=>{
  console.log('Todo By Id', todo);
}).catch((e)=>console.log(e));
