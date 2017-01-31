const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
  if (err) {
    return console.log('unable to connect');
  }
  console.log('connected to mongodb server');

   db.collection('Users').find().toArray().then((docs)=>{
    console.log(JSON.stringify(docs,undefined,2));
  },(err)=>{
      console.log('unable to find result');
    });

    db.collection('Users').find({location:'Montreal'}).count().then((count)=>{
      console.log(`count: ${count}`);
    },(err)=>{
      console.log('unable to find count',err);
    })
  })
