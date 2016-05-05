var TweetFinder = TweetFinder || {};

TweetFinder.Search = (function() {

  // Tweet Model
  // -----------------
  var Tweet = Backbone.Model.extend({
    parse: function(response) {

      // create simplified model from response data
      var model = {
        'text': this.parseText(response.text),
        'created_at': this.parseDate(response.created_at),
        'retweet_count': response.retweet_count,
        'favorite_count': response.favorite_count,
        'username': response.user.name,
        'handle': response.user.screen_name,
        'profile_url': response.user.url,
        'image': response.user.profile_image_url
      };

      // return simplified model;
      return model;
    },

    parseDate: function(text) {
      // turn Twitter's date string into a JS Date object
      var date = new Date(Date.parse(text.replace(/( +)/, ' UTC$1')));
      // return that date obj as a locale string
      return date.toLocaleString();
    },

    parseText: function(text){
      // regex patterns for matching urls, @usernames, and #hashtags
      // thanks to the internet and regexr.com for these
      var url_rgx = /[A-Za-z]+:\/\/[A-Za-z0-9-_]+.[A-Za-z0-9-_:%&~?/.=]+/g;
      var username_rgx = /[@]+[A-Za-z0-9_]+/g;
      var hashtag_rgx = /[#]+[A-Za-z0-9_]+/g;

      // parse URLs and turn them into links
      text = text.replace(url_rgx, function(match){
        return match.link(match);
      });

      // parse @usernames and turn them into links
      text = text.replace(username_rgx, function(match){
        var user_name = match.replace('@','');
        return match.link("http://twitter.com/" + user_name);
      });

      // parse hashtags and turn them into links
      text = text.replace(hashtag_rgx, function(match){
        var hashtag = match.replace('#','');
        return match.link("http://twitter.com/search?q=" + hashtag);
      });

      return text;
    }
  });


  // Tweet Collection
  // -------------------
  var TweetsCollection = Backbone.Collection.extend({
    url: '/tweets',
    model: Tweet
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

  var setEvents = function(callback) {
    $('#search-form').submit(function(e){
      e.preventDefault();
      callback();
    });

    $('.js-suggestions a').on('click', function(){
      var text = $(this).text();
      $('#twitter-handle').val(text);
      callback();
    });
  };

  return {
    TweetsCollection: TweetsCollection,
    AppView: AppView,
    setEvents: setEvents
  };
})();


// Load when ready using jQuery.ready
// ----------------------------------

$(function(){
  var instance = TweetFinder.Search;

  var tweetsCollection = new instance.TweetsCollection();
  var app = new instance.AppView({ collection: tweetsCollection });

  var getData = function() {
    tweetsCollection.fetch({ data: { name: $('#twitter-handle').val() }});
  };

  instance.setEvents(getData);
});
