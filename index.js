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

// Dummy response for development purposes
// var dummy_data = [{
//   "created_at": "5/3/2016, 2:19:56 PM",
//   "favorite_count": 438,
//   "handle": "deadmau5",
//   "image": "http://pbs.twimg.com/profile_images/679987420780077056/QvpFhc5D_normal.jpg",
//   "profile_url": "https://t.co/cnNrVJOo1H",
//   "retweet_count": 109,
//   "text": "coll lil article via @rollingstone bout me n vidya games n some other shit.  https://t.co/ijN1wCSGgy",
//   "username":"dead mow cinco"
// }];

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/tweets', function(req, res) {
  var name = req.query.name.replace("@", "");

  var params = { screen_name: name, count: 25 };

  tweet_bot.get('statuses/user_timeline', params, function(error, tweets, response){
    if(error) {
      res.send([]);
    } else {
      res.json(tweets);
    }
  });
});

app.listen(app.get('port'), function() {
  console.log('TweetFinder is running on port', app.get('port'));
  console.log('Nice job!');
});
