var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var bcrypt = require('bcrypt');

let dataList = [
  {
    name: 'John',
    age: 24,
    email: '1g42thbe@example.com'
  },
  {
    name: 'Alice',
    age: 19,
    email: '234gwsef@example.com'
  },
  {
    name: 'Bob',
    age: 28,
    email: '876jfgdf@example.com'
  }
]

let errorData = {
  name: 'ERROR'
}

/* GET api listing. */
router.get('/:id', function(req, res, next) {
  // res.send('respond with a resource');
  if(typeof dataList[req.params.id] != 'undefined'){
    res.json(dataList[req.params.id]);
  }else{
    res.json(errorData);
  }
});

router.post('/hash/get', function(req, res){
  // console.log(req.body);
  // res.send(String(req.body[0]));
  let resData;
  if(typeof req.body.text != 'string'){
    resData = {successful: false, text: 'Please send STRING'}
    res.json(resData);
  }
  // let buffer = [raw];
  // let tryCount = 1000;
  // while(buffer.length <= tryCount){ // buffer.length (1~100)
  //   let sha512Obj = crypto.createHash('sha256');
  //       sha512Obj.update(buffer.join(''));
  //   buffer.push(String(sha512Obj.digest('hex')));
  //   // console.log(`try: ${String(buffer.length - 1)}, ${buffer[buffer.length - 1]}`);
  // }
  resData = {successful: true, hash: bcrypt.hashSync(req.body.text, req.body.stretch)};
  res.json(resData);
  console.log("Responce: " + JSON.stringify(resData));
});

router.post('/hash/verify/', function(req, res){
  let resData;
  if(typeof req.body.text != 'string' || typeof req.body.hash != 'string'){
    resData = {successful: false, text: 'Please send STRING'}
    res.json(resData);
  }
  resData = {successful: true, matched: bcrypt.compareSync(req.body.text, req.body.hash)};
  res.json(resData);
  console.log("Responce: " + JSON.stringify(resData));
});

module.exports = router;
