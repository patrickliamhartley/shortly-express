Shortly.signupView = Backbone.View.extend({
  className: 'creator',

  template: Templates['signup'],

  events: {
    'submit': 'createUser'
  },

  render: function() {
    this.$el.html( this.template() );
    return this;
  },

  createUser: function(e) {
    e.preventDefault();
    var $user = this.$el.find('form .text');
    var $pass = this.$el.find('form #password');
    var user = new Shortly.User({ username: $user.val(),
    password: $pass.val() });
    user.on('request', this.changePage, this);
    user.on('sync', this.success, this);
    user.on('error', this.failure, this);
    user.save({});
    $pass.val('');
    $user.val('');
  },

  success: function(link) {
    this.stopSpinner();
    var view = new Shortly.LinkView({ model: link });
    this.$el.find('.message').append(view.render().$el.hide().fadeIn());
  },

  failure: function(model, res) {
    this.stopSpinner();
    this.$el.find('.message')
      .html('Please enter a valid URL')
      .addClass('error');
    return this;
  },

  startSpinner: function() {
    this.$el.find('img').show();
    this.$el.find('form input[type=submit]').attr('disabled', 'true');
    this.$el.find('.message')
      .html('')
      .removeClass('error');
  },

  stopSpinner: function() {
    this.$el.find('img').fadeOut('fast');
    this.$el.find('form input[type=submit]').attr('disabled', null);
    this.$el.find('.message')
      .html('')
      .removeClass('error');
  }
});
