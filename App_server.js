
// POST, create data
// PUT, update data
// GET, receive data
// DELETE, delete data

//                                  -------------------------------------------
let tokenWali = require('jsonwebtoken');
let fs = require('fs')


let myExpress = require('express');

let multer = require('multer');
// const { logDOM } = require('@testing-library/react');
// const { default: swal } = require('sweetalert');

// let swal = require('sweetalert');

const meriFileSetting = multer.diskStorage({
    destination: function (req, file, cb) {
      let path = './my-uploads/' + req.body.email;
        
        let folderParaHua = fs.existsSync(path);

        if(folderParaHua  === false){
            fs.mkdir(path,function(){
                
                cb(null, path);

            });
        }else{
            cb({message:"User Already Exist...."}, null);
        }
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  })
  
const upload = multer({ storage: meriFileSetting })

const myFileSetting = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './my-products')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})

const uploadP = multer({ storage: myFileSetting })


let myApp = myExpress();

myApp.use(myExpress.json());

let users = [];
let products = [];


myApp.post('/check-session', async (request, response)=>{

  tokenWali.verify(request.body.token , 
  '|Vpr.om7jD[*;DDL#jD[x%j`l(P<]0',
  function(err, datavar){
    if(datavar){
      let user = users.find(user=>user.id === datavar.userKiId);
      response.json(user);
      // console.log(true);
    }
    else{
      console.log(err);
      console.log(request.body.token);
    }
  });
});


// myApp.get('/login',(req,res)=>{
//   res.render('login')
// })

myApp.post('/login', function(req, res){

  // let userNotFound = users.find(user=>user.username !== req.body.username && user.password !==  req.body.password);
  let userMilgya = users.find(user=>user.username === req.body.username && user.password ===  req.body.password);
  if(userMilgya){
    tokenWali.sign({userKiId:userMilgya.id},
                   '|Vpr.om7jD[*;DDL#jD[x%j`l(P<]0',
                    {expiresIn: '2d'},
                    function(err , userToken){
                      res.json({
                        userMilgya ,
                        userToken
                      })
                    }
                    );
  }
  // res.json(userNotFound)

});


myApp.put('/user-update', upload.array('pic'), function(req, res){
  
  
  req.body.pic = req.body.email + '/' + req.files[0].originalname;

  let userIndex = users.findIndex(user=>user.id === req.body.id);
  
  let user = users[userIndex];
  fs.renameSync('./my-uploads/' + user.email, './my-uploads/'+req.body.email);
  
  users[userIndex] = req.body;

  console.log(users[userIndex]);
  console.log(req.body.id);

  // console.log(userIndex);
  // console.log(req.body.id);
  // res.json(userIndex)

  res.json({
      success:true
  })

})

myApp.get('/user-lao', function(req, res){

 let userMilgya = users.find(user=> user.id === req.query.id);
//  console.log(userMilgya);
//  console.log(req.query.id);
 res.json(userMilgya);

});


myApp.delete('/user-delete', function (req, res) {

  let user = users.find(user=>user.id === req.query.anc);
  // console.log(user);

  let dirPath = './my-uploads/' + user.email

  if(fs.existsSync(dirPath)){
    fs.rmSync(dirPath, { recursive: true, force: true });
  }

  users = users.filter(user => user.id !== req.query.anc);
  res.json(
    { 
      success: true,
      user
    }
  )
  // console.log(req.query.anc);
});


myApp.post('/create-user', upload.array('pic',20), function (request, response) {

  request.body.pic = request.body.email +'/'+ request.files[0].originalname;
  users.push(request.body);
  // let userMilgya = users.find(user=>user.email === request.body.email);
  // if(userMilgya){
  //   response.status = 403;
  //   // swal({
  //   //   title: "Error",
  //   //   text: "User Already Exist",
  //   //   icon: "error",
  //   //   timer: 2000,
  //   //   button: false
  //   // })
  // }
  // else{
  //   users.push(request.body);
  // }
  response.end("Data Uploaded");

});


// myApp.post('/create-user', function (request, response) {

//   users.push(request.body);
//   console.log(users);
//   response.end("Data Uploaded");

// });

myApp.get('/user', function (request, response) {
  // console.log("User Send")
  response.json(users);
  // response.end("Code Check");  
})

//    *************************     Header Section           *****************************

myApp.get('/header', function (request, response) {
  console.log("code send")
  response.json(users);
})


//    *************************     Product Section           *****************************
// cmmb

myApp.put('/product-update', function(req, res){

  let userIndex = products.findIndex(product=>product.id === req.body.id);
  products[userIndex] = req.body;
  // console.log(userIndex);
  // console.log(req.body.id);
  res.json(userIndex)

  res.json({
      success:true
  })

})

myApp.get('/product-lao', function(req, res){

 let userMilgya = products.find(product=> product.id === req.query.id);
 res.json(userMilgya);

});

myApp.delete('/product-delete', function (req, res) {

  products = products.filter(product => product.id !== req.query.anc);
  res.json({ success: true })
  console.log(req.query.anc);

});

myApp.post('/create-product', uploadP.array('pic',20), function (request, response) {

  request.body.pic = request.files[0].originalname;

  products.push(request.body);
  console.log(products);
  response.end("Data Uploaded");

});

// myApp.post('/create-product', function (request, response) {

//   // request.body.pic = 

//   products.push(request.body);
//   console.log(products);
//   response.end("Data Uploaded");

// });


myApp.get('/product', function (request, response) {
  // console.log("Products Send")
  response.json(products);
  // response.end("Code Check");  
})





myApp.use(myExpress.static('./build'));
myApp.use(myExpress.static('./my-uploads'));
myApp.use(myExpress.static('./my-products'));

myApp.get('*' , function(req,res){
  res.sendFile('./build/index.html')
})

myApp.use(function(err, req, res, cb){
    res.status(500).json(err);
})

myApp.listen(3003, function () {
  console.log('Code is Activated');
})
