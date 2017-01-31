const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
  if (err) {
    return console.log('unable to connect');
  }
  console.log('successfully connected');
  db.collection('Todos').deleteMany({text:'Eat lunch'}).then((result)=>{
    console.log('deleted');
  })
  db.collection('Users').findOneAndDelete({name:'Jane'}).then((result)=>{
    console.log(result);
  })
})
