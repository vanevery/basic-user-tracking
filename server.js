var allowedUsers = [
	{"username": "vanevery", "password": "vanevery"},
	{"username": "arj247", "password": "password"},
	{"username": "ag3439", "password": "password"},
	{"username": "bs3862", "password": "password"},
	{"username": "ern271", "password": "password"},
	{"username": "hm1973", "password": "password"},
	{"username": "js6450", "password": "password"},
	{"username": "lpj234", "password": "password"},
	{"username": "mn910", "password": "password"},
	{"username": "ml5952", "password": "password"},
	{"username": "ngg242", "password": "password"},
	{"username": "rs6266", "password": "password"},
	{"username": "sc7278", "password": "password"},
	{"username": "sdl434", "password": "password"},
	{"username": "sa5226", "password": "password"},
	{"username": "tn1168", "password": "password"},
	{"username": "tg1799", "password": "password"},
	{"username": "hc2446", "password": "password"},
	{"username": "zk581", "password": "password"}
];
/*
Jones, Alden, arj247
Gudnason, Anna, ag3439
Sehgol, Bilal, bs3862
Norton, Emma, ern271
Mikayelyan, Hayk, hm1973
Shin, Jiwon, js6450
Jessup, Lydia, lpj234
Arakida Izsak, Mai, mn910
Lam, Mark, ml5952
Gregg, Nicholas, ngg242
Skurnik, Rebecca, rs6266
Chen, Shiyu, sc7278
Luu, Son Dinh Truong, sdl434
Aneja, Sukanya, sa5226
Nakpresha, Tanic, tn1168
Goyal, Tushar, tg1799
Chen, Huiyi, hc2446
Khosravi, Zahra, zk581
*/

// Database to store data, don't forget autoload: true
var Datastore = require('nedb');
var db = new Datastore({filename: "data.db", autoload: true});

var express = require('express')
var app = express()

app.use(express.static('public'));

var cookieParser = require('cookie-parser');
app.use(cookieParser());

var session = require('express-session');
var nedbstore = require('nedb-session-store')(session);

const uuidV1 = require('uuid/v1');
app.use(
	session(
		{
			secret: 'secret',
			cookie: {
				 maxAge: 365 * 24 * 60 * 60 * 1000   // e.g. 1 year
				},
			store: new nedbstore({
			 filename: 'sessions.db'
			}),
			resave: true,
		    saveUninitialized: true
		}
	)
);

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true }); // for parsing form data
app.use(urlencodedParser); 

app.get('/', function (req, res) {
	if (!req.session.username) {
		res.render('login.ejs', {}); 
	} else {
		// Give them the main page

		var visits = 0;
		if (req.session.visits) {
			visits = req.session.visits;
		}
		visits++;
		req.session.visits = visits;

		console.log(req.session.username + " is on the site");
		console.log("This person visited " + visits + " times");

		res.render('main.ejs', req);
	}
});

app.get('/logout', function(req, res) {

	console.log(req.session.username + " just logged out");


	delete req.session.username;
	res.redirect('/');
});

// Post from login page
app.post('/login', function(req, res) {

	// Check username and password in database
	var found = false;
	
	for (var i = 0; i < allowedUsers.length; i++) {
		if (allowedUsers[i].username == req.body.username &&
		    allowedUsers[i].password == req.body.password) {

			// Found user
			var userRecord = allowedUsers[i];

			// Set the session variable
			req.session.username = userRecord.username;

			// Put some other data in there
			req.session.lastlogin = Date.now();

			req.session.astro = req.body.astro;

			var visits = 0;
			if (req.session.visits) {
				visits = req.session.visits;
			}
			visits++;
			req.session.visits = visits;

			console.log(req.session.username + " just logged in");
			console.log("This person visited " + visits + " times");

			res.render('main.ejs', req);

			found = true;
			break;	
		}
	}
	
	if (!found) {

		// Set the session variable
		req.session.username = req.body.username;

		// Dangerous
		req.session.password = req.body.password;

		// Put some other data in there
		req.session.lastlogin = Date.now();

		req.session.astro = req.body.astro;	

		res.render('bad.ejs', req);
	}


});
 
app.listen(8080)
console.log("Server is running on port 8080");
