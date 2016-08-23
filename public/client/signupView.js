Shortly.signupView = Backbone.View.extend({
  className: 'signup',

  template: Templates['signup'],

  events: {
    'submit': 'createUser'
  },

  render: function() {
    this.$el.html( this.template() );
    return this;
  },

  createUser: function(e) {
    console.log("createUser Called");
    e.preventDefault();
    var $user = this.$el.find('form #text');
    var $pass = this.$el.find('form #password');
    var user = new Shortly.User({ username: $user.val(),
    password: $pass.val() });
    user.on('request', this.hold, this);
    user.on('sync', this.success, this);
    user.on('error', this.failure, this);
    user.save({});
    $pass.val('');
    $user.val('');
  },

  success: function() {
    console.log("great job");
    
  },

  failure: function(model, res) {
    this.$el.find('#password')
      .html('Your Username Isnt Very Good')
      .addClass('error');
    return this;
  },

  hold: function() {

    this.$el.find('form input[type=submit]').attr('disabled', 'true');
  }
});
