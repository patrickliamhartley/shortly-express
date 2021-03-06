var express = require('express');
var util = require('./lib/utility');
var partials = require('express-partials');
var bodyParser = require('body-parser');
var session = require('express-session');
// var cookieParser = require('cookie-parser');


var db = require('./app/config');
var Users = require('./app/collections/users');
var User = require('./app/models/user');
var Links = require('./app/collections/links');
var Link = require('./app/models/link');
var Click = require('./app/models/click');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());
// Parse JSON (uniform resource locators)
app.use(bodyParser.json());
// Parse forms (signup/login)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use(session({
  name: 'shortlySession',
  secret: 'applejacks dont taste like apples',
  saveUninitialized: true,
  resave: false,
  loggedIn: false
}));

app.get('/', util.authenticate, 
function(req, res) {
  console.log('inside');
  res.render('index');
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.get('/create', util.authenticate, 
function(req, res) {
  res.render('index');
});

app.get('/signup', function(req, res) {
  res.render('signup');
});

app.get('/links', util.authenticate,
function(req, res) {
  Links.reset().fetch().then(function(links) {
    res.status(200).send(links.models);
  });
});

app.post('/links', 
function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }

  new Link({ url: uri }).fetch().then(function(found) {
    if (found) {
      res.status(200).send(found.attributes);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.sendStatus(404);
        }

        Links.create({
          url: uri,
          title: title,
          baseUrl: req.headers.origin,
          usersId: req.session.usersId
        })
        .then(function(newLink) {
          res.status(200).send(newLink);
        });
      });
    }
  });
});

/************************************************************/
// Write your authentication routes here
/************************************************************/
app.post('/login', function(req, res) {

  Users.reset().fetch().then(function() {
    var tempuser = Users.findWhere({
      username: req.body.username
    });
    if (tempuser) {
      tempuser.verify(req.body.password, function (success) {
        if (success) {
          req.session.loggedIn = true;
          req.session.username = req.body.username;
          req.session.usersId = tempuser.get('id');
          // open a live session
          res.redirect('/');
        } else {
          console.log('username or password not found');
          res.redirect('/login');
        }
      });  
    } else {
      console.log('username or password not found');
      res.redirect('/login');
      
    }  
  });
  
});

app.post('/signup', function (req, res) {

  new User({
    username: req.body.username,
    password: req.body.password,
  }).fetch().then(function(found) {
    if (found) {
      console.log('Sorry,' + req.body.username + ', you are already a user');
      res.redirect('/signup');
    } else {

      Users.create({
        username: req.body.username,
        password: req.body.password
      })
      .then(function(newUser) {
        req.session.username = req.body.username;
        req.session.loggedIn = true; 
        req.session.usersId = newUser.id;
        res.redirect('/');
      });
    }
  });

});

app.post('/logout', function(req, res) {
  req.session.loggedIn = false;
  res.redirect('/');
});

/************************************************************/
// Handle the wildcard route last - if all other routes fail
// assume the route is a short code and try and handle it here.
// If the short-code doesn't exist, send the user to '/'
/************************************************************/

app.get('/*', function(req, res) {
  new Link({ code: req.params[0] }).fetch().then(function(link) {
    if (!link) {
      res.redirect('/');
    } else {
      var click = new Click({
        linkId: link.get('id')
      });

      click.save().then(function() {
        link.set('visits', link.get('visits') + 1);
        link.save().then(function() {
          return res.redirect(link.get('url'));
        });
      });
    }
  });
});

console.log('Shortly is listening on 4568');
app.listen(4568);


