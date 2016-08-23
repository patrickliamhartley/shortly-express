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

  store: function() {

  },

  initialize: function() {
   
  }

});

module.exports = User;