var express = require('express');
var router = express.Router();

var mysql = require('mysql')
var connection = mysql.createConnection({
  host : 'localhost',
  user  :'root',
  password : '',
  database : 'new_session'
});
connection.connect(function(err){
  if(!err){
    console.log("DataBase Is Connected.");
  }
  else{
    console.log("DataBase Is Not Connected.");
  }
})
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login',);
});

router.post('/register',function(req,res,next){
  const all = {
    user_name : req.body.user_name,
    user_age : req.body.user_age,
    user_email : req.body.user_email,
    user_password : req.body.user_password
  }
  connection.query("Insert into tbl_session set ?",all,function(err,result){
    if(err) throw err;
    res.redirect('/')
  })
})

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.post('/',function(req,res,next){
  var email = req.body.user_email1;
  var password = req.body.user_password1;

  connection.query("select * from tbl_session where user_email = ? and user_password = ?",[email,password],function(err,rows){
    if (rows.length>0){
      var username = rows[0].user_name;
      var useremail = rows[0].user_email;
      var userid = rows[0].user_id;

      req.session.username = username;
      req.session.useremai = useremail;
      req.session.userid = userid;

      res.redirect('/home')
    }else{
      res.send('user name is not match')
    }
  })
})

router.get('/home', function(req,res,next){
  res.render('home');
})

router.get('/change', function(req, res, next) {
  res.render('change');
});

router.post('/change_process', function (req, res, next) {
  var userid = req.session.userid;
  var opass = req.body.opass;
  var npass = req.body.npass;
  var cpass = req.body.cpass;

  if (req.session.userid)
    connection.query("select * from tbl_session where user_id = ?", [userid], function (err, rows) {
      if (err) {
        res.send("error")
      }
      else {
        if (rows.length > 0) {
          var userpassword = rows[0].user_password;
          console.log(userpassword);

          if (opass == userpassword) {
            if (npass == cpass) {
              connection.query("update tbl_session set user_password = ? where user_id = ?", [npass, userid], function (err, rows) {
                res.send("bale bale")
              });
            }
            else {
              res.send("New Password and Confirm Password Are not Match")
            }
          }
          else {
            res.send("Old Password not Match")
          }
        }
        else {
          res.send("No Record Found") 
        }
      }
    });
  else {
    res.redirect('/login')
  }
})

router.get('/get-user-api', function(req,res,next){
  connection.query("select * from tbl_session", function(err,rows){
    if(err){
      res.send(JSON.stringify({"status": 500, "flag": 0,  "message": "Error", "data": err}));
    }else{
      console.log(rows);
      res.send(JSON.stringify(rows));
    }
  })
})

router.post('/add-user-api', function(req,res,next){
  const myd = {
    user_name : req.body.user_name,
    user_age : req.body.user_age,
    user_email : req.body.user_email,
    user_password : req.body.user_password
  }
  connection.query("insert into tbl_session set ?",myd,function(err,result){
    if(err){
      res.send(JSON.stringify({"status" : 500, "flag" : 0, "message" : "Data Fetch", "data" : err}));
    }else{
      res.send(JSON.stringify({"status" : 200, "flag" : 1, "message" : "Data Fetch", "data"  : ''}));
    }
  })
})

router.put('/update-user-api/:id', function(req,res,next){
  var user_id = req.params.id;
  var user_name = req.body.user_name;
  var user_age = req.body.user_age;
  var user_email = req.body.user_email
  var area_id =req.body.area_id;

  connection.query("update tbl_session set user_name=?, user_age=?, user_email=? where user_id=? ",[user_name,user_age,user_email,area_id,user_id], function(err,respond){
    if(err){
      res.send(JSON.stringify({"status" : 500, "flag" : 0, "message" : "Data Fetch", "data" : err}));
    }else{
      res.send(JSON.stringify({"status" : 200, "flag" : 1, "message" : "Data Fetch", "data"  : ''}));
    }
  })
})

router.delete('/delete-user-api/:id', function(req,res,next){
  var deleteid = req.params.id;

  connection.query("delete from tbl_session where user_id = ?",[deleteid],function(err,rows){
    if(err){
      res.send(JSON.stringify({"status" : 500, "flag" : 0, "message" : "Error", "data" : err}));
    }else{
      res.send(JSON.stringify({"status" : 200, "flag" : 1, "message" : "Data Deleted", "data" : '' }));
    }
  })
})


module.exports = router;

