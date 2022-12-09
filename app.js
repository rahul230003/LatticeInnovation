const express = require('express');
var app = express();
const path = require('path');
var fileUpload = require('express-fileupload');
const mysql = require('mysql');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
	
var connection = mysql.createConnection({
	host     : 'sql6.freesqldatabase.com',
	user     : 'sql6583505',
	password : 'Ury1jTs1mq',
	database : 'sql6583505'
});
 
connection.connect();

global.db = connection;
 
// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

app.get("/",function(req,res){
    res.sendFile(__dirname + '/public/details.html');
});
app.post("/pdetails",function(req,res){
    //validations at backend
    var err="";
    var num = req.body.phoneno;
    if(!req.body.exampleInputEmail1 || !req.body.exampleInputPassword1 || !req.body.patientname || !req.body.phoneno || !req.body.address){
        return res.status(400).send({
            message: "Please fill all the required feilds"
        })
    }
    else if(num.length<13){
        err+="Please Check the phone number or enter country code";
        return res.status(400).send({
            message: err
        });

    }
    else{
        var sql = "INSERT INTO `patient`(`Name`,`address`,`email`,`phoneno`,`password`,`photo`) VALUES ('" + req.body.patientname + "','" + req.body.address + "','" + req.body.exampleInputEmail1 + "','" + req.body.phoneno + "','" + req.body.exampleInputPassword1 + "','" + req.body.photo + "')";
 
    	var query = db.query(sql, function(err, result) {
    	                    res.sendFile(__dirname + '/public/success.html');
    						});
    }
})
app.get("/getallpatientrecords",function(req,res){
    var sql = "SELECT * FROM `patient`";
    var query = db.query(sql,function(err,record){
         res.render('index.ejs',{data:record});
    })
});
app.get("/hospitalpage",function(req,res){
   res.sendFile(__dirname + '/public/selected.html');
});

app.post("/hospital",function(req,res){
  
   var id = req.body.hospitalID;
  
   var sql = "SELECT `HospitalName`,`psychologistName`,`PatientName` FROM `psychiatrists` where HospitalID='"+id+"';";
    var query = db.query(sql,function(err,record){
        res.status(201).send({response:record});
    })
  

    

});
app.listen(3000,function(){
    console.log("Server running");
})