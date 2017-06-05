"use strict"

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express  = require('express');
var url = require('url');
var $ = require('jquery');
var _ = require('lodash');
var request = require('request');
var FB = require('fb');

var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('./db');


passport.use(new Strategy(
	function(username, password, cb) {
		db.users.findByUsername(username, function(err, user) {
			if (err) { return cb(err); }
			if (!user) { return cb(null, false); }
			if (user.password != password) { return cb(null, false); }
			return cb(null, user);
		});
	}));

passport.serializeUser(function(user, cb) {
	cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
	db.users.findById(id, function (err, user) {
		if (err) { return cb(err); }
		cb(null, user);
	});
});




var typeCounter = {
	LIKE: 0,
	LOVE: 0,
	WOW: 0,
	HAHA: 0,
	SAD: 0,
	ANGRY: 0
}

var tickerList = [];
var idCounter = 0; 
var msgData = [];
var polls = [];
var pollData = {};
var emojiData = {};
emojiData.reactions = [];
emojiData.reactionsShown = [];
var refreshRate = 500;
emojiData.limit = 40;
emojiData.connected = false;
emojiData.postID = undefined;
emojiData.typeCounter = {
	LIKE: 0,
	LOVE: 0,
	WOW: 0,
	HAHA: 0,
	SAD: 0,
	ANGRY: 0
}
emojiData.count = {
	like: undefined,
	love: undefined,
	haha: undefined,
	angry: undefined,
	sad: undefined,
};
emojiData.counter = 0;
emojiData.baseline = {};
emojiData.baseline.love = 0;

emojiData.baseline.haha = 0;

emojiData.access_token = '369577906743625|0VPUwP1JlXagmBwWHvgWFbBa_sE';

//getEmojiData();
//setInterval(updateEmojiData, refreshRate);

function updateEmojiData(){
	if(emojiData.postID !== undefined){
		//getEmojiData();
		io.emit('getEmojiData',emojiData);
	}	
}











// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Define routes.
app.use(express.static(__dirname + '/public'));


app.set('views', __dirname + '/views');

// app.get('/', function(req, res){
// 	res.render(__dirname + '/views/control_panel.html');
// });
app.get('/overlay', function(req, res){
	res.sendFile(__dirname + '/views/overlay.html');
});

app.get('/',
	function(req, res) {
		res.render(__dirname + '/views/home.ejs', { user: req.user });
	});

app.get('/login',
	function(req, res){
		res.render(__dirname + '/views/login.ejs');
	});

app.post('/login', 
	passport.authenticate('local', { failureRedirect: '/login' }),
	function(req, res) {
		res.redirect('/');
	});

app.get('/logout',
	function(req, res){
		req.logout();
		res.redirect('/');
	});

app.get('/controlpanel',
	require('connect-ensure-login').ensureLoggedIn(),
	function(req, res){
		res.sendFile(__dirname + '/views/control_panel.html', { user: req.user });
	});




















io.on('connection', function(socket){
	sendMsgData();
	emitTickerList();
	initData();
	socket.on('chat message', function(msg){
		msgData.push(msg);
		io.emit('chat message', msg);
		sendMsgData();
	});
	socket.on('pollState', function(_data){
		console.log(_data);
		var data = _data;
		data.bool = _data.bool;
		if(_data){
			data.minutes = _data.minutes;
			emojiData.baseline.love = emojiData.count.love;
			emojiData.baseline.haha = emojiData.count.haha;
			console.log(data);

		}
		console.log(data);

		io.emit('showPoll', data);
	});

	socket.on('winHaha', function(_data){
		io.emit('winHaha', _data);
	});
	socket.on('winLove', function(_data){
		io.emit('winLove', _data);
	});


		socket.on('newPostID',function(_ID){
			emojiData.postID = _ID;
			io.emit('getEmojiData',getEmojiData());	

		});

		socket.on('oproep',function(_data){
			//io.emit('oproep', _data);	
		});
		socket.on('comment',function(_data){
			//io.emit('comment', _data);	
		});

		socket.on('selectedComment',function(_comment){
			facebookData.selectedComment = _comment;
			io.emit('returnSelectedComment', _comment);	
		});

		socket.on('teams',function(_data){
			console.log('in')
			teams.team_love = _data.team_love;
			teams.team_haha = _data.team_haha;

			console.log(teams);

			//io.emit('teams', teams);	
		});

	});


function initData(){
	var data = {};
	data.teams = teams;
	data.emojiData = emojiData;
	io.emit('initData', data);
}
function syncData(){
	var data = {};
	data.teams = teams;
	data.emojiData = emojiData;
	io.emit('syncData', data);
}

http.listen(process.env.PORT || 3000);

function emitPollData(){
	io.emit('getPollData',pollData);	
}



function newPostID(_id){
	emojiData.postID = _id;
}
function sendProfile(_data){
	io.emit('getProfile',_data);
	console.log('send'+_data)
}








var facebookData = {};
facebookData.comments = [];
facebookData.selectedComment = [];

var teams = {};
teams.team_haha = [];
teams.team_love = [];

FB.setAccessToken('369577906743625|0VPUwP1JlXagmBwWHvgWFbBa_sE');
var updateSpeed = 1000;



//getFacebookData();


function update(){
	if(emojiData.postID !== undefined){
		//getFacebookData();	
		//getEmojiData();


		if(emojiData.reactions[emojiData.counter]){
			for(var i = 0; i < emojiData.reactionsShown.length; i++){
				if(emojiData.reactionsShown[i].id === emojiData.reactions[emojiData.counter].id){
					return;
				}
			}	
			emojiData.reactionsShown.push(emojiData.reactions[emojiData.counter]);

			for (var k in emojiData.typeCounter){
				if(k ===  emojiData.reactions[emojiData.counter].type){
					emojiData.typeCounter[k]++;
					if(emojiData.reactions[emojiData.counter].type === "LOVE" ||
						emojiData.reactions[emojiData.counter].type === "HAHA" ||
						emojiData.reactions[emojiData.counter].type === "WOW" ){
						sendProfile(emojiData.reactions[emojiData.counter]);
				}
			}
		}
		emojiData.counter++;	
	}	
	syncData();
}

}

function getFacebookData(){
	FB.api(
		'/'+emojiData.postID+'/comments',
		'GET',
		{"fields":"message,id,from{name,picture}","limit":"100","order":"reverse_chronological"},
		function(res) {
			facebookData.comments = res.data;
			//getProfilePicture(facebookData.comments);
			io.emit('fbComments', facebookData.comments);	

		}
		);
}

function getProfilePicture(_comments){
	//profile pictue
	for(var i = 0; i < _comments.length; i++){
		FB.api(
			"/"+_comments[i].id+"/picture",
			function (res) {
				if (res && !res.error) {
					console.log(res);
				} 
			}
			);
	}	
}


function getEmojiData(){
	FB.api(
		'/'+emojiData.postID+'/reactions',
		'GET',
		{"fields":"pic_large,name,type","limit":emojiData.limit},
		function(res) {
			if(!res || res.error) {
				console.log(!res ? 'error occurred' : res.error);
				return;
			}
			for(var i = 0; i < res.data.length; i++){
				for(var j = 0; j < emojiData.reactions.length; j++){
					if(res.data[i].id === emojiData.reactions[j].id){
						return;
					}	
				}
				emojiData.reactions.push(res.data[i]);
			}
		}
		);
}

//setInterval(update, updateSpeed);
//update();