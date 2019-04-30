const express = require('express');
const app = express();
const port = 3005;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static('public'));


app.use(function (req, res, next) {
    console.log('auth middle-ware');
    console.log('pre-check the cookie and the authorization http headers');

    let host = req.headers['host'];
    let auth_token = req.headers['authorization'];
    console.log('host:%s, url:%s, auth_token:%s', host, req.url, auth_token);
    console.log('headers: ', req.headers);

    next();
});

app.use(function (req, res, next) {
    console.log('pre check cookies middle-ware');
    //check the cookieTest if it set or not
    // maybe this is unuse.
    let cookie = req.cookies.cookieTest;
    if(cookie === undefined){
        // no: set a new cookie

    }else {
        // yes, cookie was already preset
    }

    res.cookie('cookieTest2', 'randomNumber1', { maxAge: 900000 });
    res.cookie('cookieTest3', 'randomNumber2', { maxAge: 900000 });
    res.cookie('cookieTest4', 'randomNumber3', { maxAge: 900000 });

    console.log('cookies: ', req.cookies);
    
    next();
});

const auth = require('./routes/auth');
const test = require('./routes/testData');

app.use('/auth', auth);
app.use('/test', test);



app.get("/", (req, res)=>{
    console.log('someone called me!!');
    console.log(__dirname+"/../"+"public/index.html");
    res.sendFile("/index.html", {root: __dirname+"/../"+"public"});
});


// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    console.log('****');
    console.log(__dirname+"/../"+"public/index.html");
    res.sendFile("/index.html", {root: __dirname+"/../"+"public"});
});


const server = app.listen(
    port, 
    ()=> {
        let host = server.address().address;
        let port = server.address().port;
        console.log("The server is listening on at http://%s:%s", host, port);
    }
    );
