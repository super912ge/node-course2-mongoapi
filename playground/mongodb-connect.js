const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
  if (err) {
    return console.log('unable to connect');
  }
  console.log('connected to mongodb server');

  // db.collection('Todos').insertOne({
  //   text:'Something to do',
  //   completed: false
  // },(err,result)=>{
  //   if (err) {
  //     return console.log('unable to insert',err);
  //   }
  //   console.log('success', JSON.stringify(result.ops,undefined,2));
  // })
  db.collection('Users').insertOne({
    name: 'Jason',
    age: 27,
    location: 'New York'
  },(err,result)=>{
    if(err){
      return console.log('failed ',err);

    }
    console.log('succeeded ',JSON.stringify(result.ops,undefined,2));
  })


  db.close();
})
