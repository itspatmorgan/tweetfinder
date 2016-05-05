# TweetFinder App
#### A simple app for getting a Twitter user's last 25 tweets

<http://tweetfinder.herokuapp.com>

**Server Side Tech**: Node.js, Express, Twitter Node Module <br>
**Client Side Tech**: Backbone.js, Underscore, jQuery, Pure.css, FontAwesome

## Design choices

**Tech Stack Thoughts**

I knew from the start this would be a small app, so I wanted to keep its library footprint small as well. 

*On the client side* I chose to use Backbone since I knew it would provide a solid base for creating a single page app while not overloading me with features I knew I would never use.

*On the server side* I opted for Node with Express because I knew I would only need one route (a GET request to `/tweets`). Rails is great, but it seemed like overkill in this case. And since Heroku already plays nicely with Node it was an easy choice.

*For linking up with Twitter*, I found a Node Module wrapper that simplified the OAuth based communication between my app and the Twitter API. I haven't had to interact with OAuth much in my career to this point, so I was glad to have a library to streamline that process.

**JS Thoughts**

First I created a namespace for the whole app:

`var TweetFinder = TweetFinder || {};`

Then I created a Search module on that object to contain the core of my Backbone search functionality:

```js
TweetFinder.Search = (function() {

  // backbone code goes here

})();
```

At the top level of the Search module I have five functions:

```js
// Backbone Model for a Tweet
var Tweet = Backbone.Model.extend();

// Backbone Collection - An array of Tweet models
var TweetsCollection = Backbone.Collection.extend();

// Backbone View for an individual Tweet
var TweetView = Backbone.View.extend();

// Backbone View for the Tweet Search app which contains TweetViews
var AppView = Backbone.View.extend();

// Utility where I set the two user action event listeners
var setEvents = function(ajax_func){};
```

Inside of the *Tweet Model* I use the native Backbone method `parse` as well as two of my own methods `parseDate` and `parseText` to create a simplified and formatted Tweet object from the original Twitter API response.

In the *TweetsCollection*, I just link the collection to its associated model and url.

In the *TweetView*, I tell the Tweet what to use as its html element, class name and underscore template. Then I tell it how to render itself.

In the *AppView*, on initialization I show a welcome placeholder template where the list of Tweets will populate after a search. Also on init I start using Backbone `listenTo` to respond when the view's associated collection syncs. On sync, AppView calls its render method, which first checks if the response brought back results and then renders either the found Tweets or an empty set if no results returned.

In *setEvents*, I set a `submit` listener on the search form, and a `click` listener on suggested searches.

At the end of the module, I return an object with the three functions I need to be public outside of the Search Module.

```js
  return {
    TweetsCollection: TweetsCollection,
    AppView: AppView,
    setEvents: setEvents
  };
```

And finally, for actually running the app:

```js
  $(function(){
    var instance = TweetFinder.Search;

    var tweetsCollection = new instance.TweetsCollection();
    var app = new instance.AppView({ collection: tweetsCollection });

    var getData = function() {
      tweetsCollection.fetch({ data: { name: $('#twitter-handle').val() }});
    };

    instance.setEvents(getData);
  });
```

When jQuery says the document is ready, I first create an instance of the Search module. Then I instantiate a TweetsCollection and an AppView, linking the AppView to that collection. Then I include a simple function that wraps Backbone's fetch method, where we actually make the Ajax GET request passing the twitter handle search value to the server. Finally, I set the event listeners, passing in the getData function for use when those events occur.

**CSS Thoughts**

All I wanted to get going was a simple grid system and maybe a few basic styles, so I decided to give Yahoo's Pure.css project a shot.

After working with it a bit, it seems useful. Definitely much leaner than Bootstrap or Foundation, but more robust than Skeleton or a grid on its own. Ultimately I probably could have gotten by with even less, but it was good to try it out for future reference.

I also included FontAwesome to get easy access to Twitter icons. I only used 5 of the icons, so I could have hunted down SVGs and used them instead. But FontAwesome had the icons I needed easily available so I stuck with that service for now.

On a bigger project I would use Sass for my styling, but I didn't think it was worth adding a build process to such a simple app. Also, I use a decent amount of CSS3 which I'd need to build fallback support for if this were an enterprise app. So on an enterprise app I would use Gulp or Grunt to do (at least) the following: compile the Sass, manage CSS vendor prefixes, and concatenate and minify files.

## Setup Instructions

### Local Setup

You'll need to use your own Twitter API credentials to run the app locally. Once you get those from Twitter, put them into your `.bash_profile` (or preferred environment config file) like below:

```
export CONSUMER_KEY=reallylongstringfromtwitter
export CONSUMER_SECRET=reallylongstringfromtwitter
export ACCESS_TOKEN_KEY=reallylongstringfromtwitter
export ACCESS_TOKEN_SECRET=reallylongstringfromtwitter
```

The app will then use those environment variables to communicate with the Twitter API.

**To get the App from Github and start it locally, run these commands:**<br>
*Assuming you have Git, Node.js and NPM installed locally. If not, install them first.*

- `git clone https://github.com/patrickmmorgan/tweetfinder.git`
- `cd tweetfinder`
- `npm install`
- `node index.js`
- Go to localhost:5000 in browser

### Remote Setup on Heroku

**Basics**

- Install the Heroku toolbelt <https://toolbelt.heroku.com/>
- `heroku login` --> Follow prompts

**Link local project with remote**<br>
*Start in the `tweetfinder` directory*

- `heroku create` --> Heroku will name the app for you
- `git add .`
- `git commit -am "committing for Heroku"`
- `git push heroku master`

**Set config variables on the remote environment**

- For each of the four environment variables run the following:
  - `heroku config:set ENVIRONMENT_VAR=reallylongstringfromtwitter`
  - OR you can set config vars on heroku.com under the settings tab for your app

**See the site at `http://your-heroku-app-name.herokuapp.com`**
