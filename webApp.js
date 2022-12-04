const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');

var serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

var express = require('express');
var app = express();
app.set("view engine", "ejs");

let alert = require('alert');

app.get('/', function(request, response){
    response.send('This is my first web app!');
})

app.get('/login', function(request, response){
    //console.log(__dirname);
    response.sendFile(__dirname+"/loginPage.html");
})

var obj;

app.get('/loginsubmit', function(request, response){
    var email = request.query.email;
    var passwd = request.query.password;
    console.log(email+" "+passwd);
    let flag = false;
    if(email && passwd){
        db.collection('WD201-ProjectSingupDeatils').where('email', '==', email).where('pwd','==',passwd).get().then(
            function (docs){
                docs.forEach(function(doc){
                    flag = true;
                    obj = doc.data();
                    console.log("Successful!");
                    alert("Login successful !");
                    response.render("newMainPage.ejs", {data : obj});  
                    //response.sendFile(__dirname+"/views/pages/userprofile.ejs");
                });  
                if(!flag){
                    console.log("Failed");
                    alert("Enter valid credentials!");
                    response.sendFile(__dirname+"/loginPage.html");
                }
         })   
    }
    else{
        console.log("Enter all details");
        alert("Please enter all details")
        response.sendFile(__dirname+"/loginPage.html");
    }
})

app.get('/signup', function(request, response){
    //console.log(__dirname);
    response.sendFile(__dirname+"/signUpPage.html");
})

app.get('/signupsubmit', function(request, response){
    pwd = request.query.password;
    cpwd = request.query.confirmpassword;
    fname = request.query.firstName;
    lname = request.query.lastName;
    dob = request.query.dob;
    email = request.query.email;
    addr = request.query.add;
    phnNo = request.query.phno;
    if(pwd == cpwd && pwd != "" && cpwd != "" && fname != "" && lname != "" && email != "" && phnNo != "" && addr != ""){
        db.collection('WD201-ProjectSingupDeatils').add({
            firstname:request.query.firstName,
            lastname:request.query.lastName,
            email:request.query.email,
            phoneNumber:request.query.phno,
            DOB : request.query.dob,
            gender : request.query.gender,
            address : request.query.add,
            pwd:pwd
        })
    }
    response.sendFile(__dirname+"/homePage2.html");
})

var cartItems = [];
var totalcost = 0;

app.get('/addToCart', function(req, res){
    cartItems.push({'item': req.query.Tabletname, cost : req.query.cost});
    console.log(cartItems);
    totalcost += Number(req.query.cost);
    alert("Added to cart successfully!");
    res.render("newMainPage.ejs", {data : obj});
})

app.get('/cartPage', function(req, res){
    res.render("cartPage.ejs", {data : cartItems});
})

app.get('/userMainPage', function(req, res){
    res.render("newMainPage.ejs", {data : obj});
})

app.get('/forgotpassword', function(req, res){
    res.sendFile(__dirname+"/forgotpassword.html");
})

app.get('/aboutPage', function(req, res){
    res.render("aboutPage.ejs",{data:obj});
})

app.get('/homepage', function(req, res){
    totalcost = 0;
    cartItems = [];
    res.sendFile(__dirname+"/homePage2.html");
})
app.get('/paymentPage',function(req, res){
    // totalcost = totalcost.toFixed(2);
    var object = {cost:totalcost};
    res.render("paymentPage.ejs", {data:object});
})
app.get('/finalPage',function(req,res){
    res.render("ack.ejs", {data : obj});
})
app.get('/bpcalculator',function(req,res){
    res.sendFile(__dirname+"/BPcal.html");
})
app.listen(7040, function(){
    console.log("MediHome Website says hello!");
})

app.get('/searchItem', function(req, res){
    var item = req.query.tabletName;
    var flag = false;
    if(item != ""){
        db.collection('Tablets').where('tabletName', '==', item).get().then(
            function (docs){
                docs.forEach(function(doc){
                    flag = true;
                    tabletObj = doc.data();
                    console.log(tabletObj);
                    console.log("Tablet Found!");
                    res.render("searchResult.ejs", {data : tabletObj});  
                    //response.sendFile(__dirname+"/views/pages/userprofile.ejs");
                });  
                if(!flag){
                    console.log("Tablet not found");
                    alert("Tablet not found");
                    res.render("newMainPage.ejs", {data : obj});
                }
         })
    }
    else{
        alert("Enter tablet name");
        res.render("newMainPage.ejs", {data : obj});
    }
})

app.get('/childSection', function(req, res){
    res.render("childCare.ejs", {data : obj});
})