// Tweet Model
// -----------------

var Tweet = Backbone.Model.extend();


// Tweet Collection
// -------------------

var TweetsCollection = Backbone.Collection.extend({
  url: '/tweets',
  model: Tweet
});


// Tweet View
// The DOM element for a tweet
// ------------------

var TweetView = Backbone.View.extend({
  tagName: 'li',
  className: 'tweet',
  template: _.template($('#tweet-template').html()),

  render: function() {
    var html = this.template(this.model.toJSON());
    this.$el.html(html);
    return this;
  }
});


// App View
// The outer app view
// -----------------

var AppView = Backbone.View.extend({
  el: '#twitter-app',

  render: function () {
    var $list = this.$('#tweets-list').empty();

    this.collection.each(function(model) {
      var tweet = new TweetView({ model: model });
      $list.append(tweet.render().$el);
    }, this);

    return this;
  },

  initialize: function() {
    this.listenTo(this.collection, 'sync', this.render);
  }
});

// Load when ready using jQuery.ready
$(function(){
  var tweetsCollection = new TweetsCollection(),
      app = new AppView({ collection: tweetsCollection });

  $('#search-btn').click(function(){
    tweetsCollection.fetch({
      data: { name: $('#twitter-handle').val() }
    });
  });
});

