var express = require('express');
var app = express();
var Twitter = require('twitter');

// Twitter config info
var tweet_bot = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/tweets', function(req, res) {
  var params = { screen_name: req.query.name, count: 1 };

  tweet_bot.get('statuses/user_timeline', params, function(error, tweets, response){
    if(error) {
      res.send([]);
    } else {
      res.json(tweets);
    }
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
