// Tweet Model
// -----------------

var Tweet = Backbone.Model.extend();


// Tweet Collection
// -------------------

var TweetsCollection = Backbone.Collection.extend({
  url: '/tweets',
  model: Tweet,

  parse: function(response) {
    var results = [];

    for (var i = 0; i < response.length; i++) {
      var model = {
        'text': this.parseText(response[i].text),
        'created_at': this.parseDate(response[i].created_at),
        'retweet_count': response[i].retweet_count,
        'favorite_count': response[i].favorite_count
      };

      results.push(model);
    }

    return results;
  },

  parseDate: function(text) {
    var date = new Date(Date.parse(text.replace(/( +)/, ' UTC$1')));
    return date.toLocaleString();
  },

  parseText: function(str){
    var url_reg = /[A-Za-z]+:\/\/[A-Za-z0-9-_]+.[A-Za-z0-9-_:%&~?/.=]+/g;
    var username_reg = /[@]+[A-Za-z0-9_]+/g;
    var hashtag_reg = /[#]+[A-Za-z0-9_]+/g;

    //parse URL
    str = str.replace(url_reg, function(s){  
      return s.link(s);
    });

    //parse user_name
    str = str.replace(username_reg, function(s){
      var user_name = s.replace('@','');
      return s.link("http://twitter.com/" + user_name);
    });

    //parse hashtag
    str = str.replace(hashtag_reg, function(s){
      var hashtag = s.replace('#','');
      return s.link("http://search.twitter.com/search?q=" + hashtag);
    });

  return str;
  }
});


// Tweet View
// ------------------

var TweetView = Backbone.View.extend({
  tagName: 'div',
  className: 'tweet',
  template: _.template($('#tweet-template').html()),

  render: function() {
    var html = this.template(this.model.toJSON());
    this.$el.html(html);
    return this;
  }
});


// App View
// -----------------

var AppView = Backbone.View.extend({
  el: '#twitter-app',

  checkResponse: function() {
    if (this.collection.length) {
      this.renderFull();
    } else {
      this.renderEmptySet();
    }
  },

  render: function () {
    this.checkResponse();
    return this;
  },

  renderEmptySet: function() {
    var $list = this.$('#tweets-list').empty();

    var tpl = _.template($('#empty-set').html());
    $list.append(tpl);
  },

  renderFull: function() {
    var $list = this.$('#tweets-list').empty();

    this.collection.each(function(model) {
      var tweet = new TweetView({ model: model });
      $list.append(tweet.render().$el);
    }, this);
  },

  showPlaceholder: function() {
    var $list = this.$('#tweets-list').empty();
    var tpl = _.template($('#welcome-placeholder').html());
    $list.append(tpl);
  },

  initialize: function() {
    this.listenTo(this.collection, 'sync', this.render);  
    this.showPlaceholder();  
  }
});


// Load when ready using jQuery.ready
// ----------------------------------

$(function(){
  var tweetsCollection = new TweetsCollection(),
      app = new AppView({ collection: tweetsCollection });

  $('#search-form').submit(function(e){
    e.preventDefault();

    tweetsCollection.fetch({
      data: { name: $('#twitter-handle').val() }
    });
  });
});
