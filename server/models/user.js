var mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
console.log('user.js');
var UserSchema = new mongoose.Schema({
  email:{
    type: String,
    required: true,
    trim:true,
    minlength:5,
    unique:true,
    validator:{
      validator:validator.isEmail,
      message:'{VALUE} is not a valid email address'
    }
  },
  password: {
    type:String,
    require: true,
    minlength:6
  },
  tokens:[{
    access:{
      type:String,
      required:true
    },
    token:{
      type:String,
      required:true
    }
  }]
});
UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
    console.log(user);
  var token = jwt.sign({_id : user._id.toHexString(), access},'secret').toString();
  console.log(token);
  user.tokens.push({access,token});
  user.save().then(()=>{
    return token;
  });
};
UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;
    try{
      decoded = jwt.verify(token,'secret');
    }catch(e){
      return Promise.reject();
    }
    return User.findOne({
      '_id' : decoded._id,
      'tokens.token' : token,
      'tokens.access' : 'auth'
    })
}
UserSchema.pre('save',function (next) {
  var user = this;
  if(user.isModified('password')){
    bcrypt.genSalt(10,(err,salt)=>{
      bcrypt.hash(user.password,salt,(err,hash)=>{
        user.password = hash;
        next();
      })
    })
  }else {
    next();
  }
})

var User = mongoose.model('User',UserSchema);


module.exports = {User};
