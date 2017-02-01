const expect = require('expect');
const request = require('supertest');
var {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  _id: new ObjectID(),
  text:"first test todo"
},{
  _id: new ObjectID(),
  text:"second test todo"
}];
beforeEach((done)=>{
  Todo.remove({}).then(()=>{
    return Todo.insertMany(todos);

  }).then(()=>done());
});

describe('POST /todo',()=>{
  it('should create new todo',(done)=>{
    var text = 'test todo text';
    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect((res)=>{
      expect(res.body.text).toBe(text);
    })
    .end((err,res)=>{
      if(err){
        return done(err);
      }
      Todo.find({text}).then((todos)=>{
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e)=>done(e));
    })
  })
  it('should not create todo with invalid body data',(done)=>{
    var text = {};
    request(app)
    .post('/todos')
    .send({text})
    .expect(400)
    .expect((res)=>{
      console.log(res.body.text);
      expect(res.body.text).toBe(undefined);

    })
    .end((err,res)=>{
      if(err){
        return done(err);
      }
      Todo.find().then((todos)=>{
        expect(todos.length).toBe(2);
        done();
      }).catch((e)=>done(e));
    })
  })
})

describe('GET /todos',()=>{
  it('should get all todos',(done)=>{
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res)=>{
      expect(res.body.todos.length).toBe(2);
    })
    .end(done);
  })

    it('get first todo',(done)=>{
      request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(todos[0].text);
      }).end(done);
    });
    it('get 404 if todo not found',(done)=>{
      request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .expect((res)=>{
        expect(res.body.message).toBe('not found');
      }).end(done);

    });
    it('get 400 if bad request',(done)=>{
      request(app)
      .get('/todos/123')
      .expect(400)
      .expect((res)=>{
        expect(res.body.message).toBe('id not valid');
      }).end(done);
    })
})

describe('PATCH /todos',()=>{
  it('should get 200 and response body',(done)=>{
    var body = {
      completed:true
  };
    request(app)
    .patch(`/todos/${todos[0]._id.toHexString()}`)
    .send(body)
    .expect(200)
    .expect((res)=>{
      console.log(todos[0]._id);
      expect(res.body.todo.completed).toBe(body.completed);
      expect(res.body.todo._id).toBe(todos[0]._id.toHexString())
      if(body.completed){
        expect(res.body.todo.completedAt).toNotBe(null);
      }else {
        expect(res.body.todo.completedAt).toBe(null);
      }
    }).end(done);
  })
})
