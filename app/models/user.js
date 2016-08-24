var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');



var User = db.Model.extend({
  tableName: 'users',
  defaults: {
    username: null,
    password: null,
    loggedIn: false
  },
  users: function() {
    return this.hasMany(Link);
  },

  verify: function(pass, cb) {

    var hash = this.get('password');
    bcrypt.compare(pass, hash, function (err, res) {
      
      cb(res);
      
    });

  },

  initialize: function() {

    this.on('add', function(model, attrs, options) {


      // console.log('fdsa');

      // bcrypt.genSalt(10, function(err, salt) {
        
      //   model.set('salt', salt);
      var pass = model.get('password');
      console.log('Plaintext pass is: ', pass);

      bcrypt.hash(pass, null, null , function(err, hash) {
          
        console.log('inside new hash thing');
        console.log(hash);
        model.set('password', hash);
        model.save();
                // Store hash in your password DB. 
      });



        // bcrypt.hash(pass, salt, function(err, hash) {
        //   console.log('inside bcrypt hash');
        //   model.set('password', hash);
        //   model.save();
        // });
        

      // });

      // var shasum = crypto.createHash('sha1');
      // shasum.update(model.get('url'));
      // model.set('code', shasum.digest('hex').slice(0, 5));



    });
   
  }

});

module.exports = User;