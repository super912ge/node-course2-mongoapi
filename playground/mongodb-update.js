const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
  if (err) {
    return console.log('unable to connect');
  }
  console.log('successfully connected');

  db.collection('Todos').findOneAndUpdate({
    _id: new ObjectID('5890c1f11474e6cbf33e369e')
  },{
    $set:{
      completed: false
    }
  },{
    returnOriginal: false
  }).then((result)=>{
    console.log(result);
  })

  db.collection('Users').findOneAndUpdate({
    name: 'Jason'
  },{
    $set:{
      name : 'Yiwei'
    },
    $inc:{
      age: 1
    }
  },{
    returnOriginal:false
  }).then((result)=>{
    console.log(result);
  })
})
