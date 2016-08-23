Shortly.Router = Backbone.Router.extend({
  initialize: function(options) {
    this.$el = options.el;
  },

  routes: {
    '': 'index',
    'create': 'create',
    'login': 'login',
    'signup': 'signup'
  },

  swapView: function(view) {
    this.$el.html(view.render().el);
  },

  login: function() {
    this.swapView();
  },

  signup: function() {
    var signupview = new Shortly.signupView();
    this.swapView(signupview);
  },

  index: function() {
    var links = new Shortly.Links();
    var linksView = new Shortly.LinksView({ collection: links });
    this.swapView(linksView);
  },

  create: function() {
    this.swapView(new Shortly.createLinkView());
  }
});
