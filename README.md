# TweetFinder App
#### A simple app for getting a Twitter user's last 25 tweets

<http://stackcomtweets.herokuapp.com>

**Server Side Tech**: Node.js, Express, Twitter Node Module <br>
**Client Side Tech**: Backbone.js, Underscore, jQuery, Pure.css, FontAwesome

## Design choices

**First Thoughts: Keep in Simple**

I knew from the start this would be a small app, so I wanted to keep its library footprint as small as possible as well. 

*On the client side* I chose to use backbone since I knew it would provide a solid base for creating a single page app while not overloading me with features I knew I would never use.

*On the server side* I opted for Node with Express because I knew I would only need one route (a GET request to `/tweets`). Rails is great, but it seemed like overkill in this case. And since Heroku already plays nice with Node it was an easy choice.

*For linking up with Twitter*, I found a Node Module wrapper that simplified the OAuth based communication between my app and the Twitter API. I haven't had to interact with OAuth much in my career to this point, so I was glad to have a library to make that process easier.

**JS Thoughts**


**CSS Thoughts**

All I really wanted to get going was a simple grid system and maybe a few basic styles, so I decided to give Yahoo's Pure.css project a shot.

After working with it a bit, it seems useful. Definitely much leaner than Bootstrap or Foundation, but most robust than Skeleton or a grid on its own. Ultimately I probably could have gotten by with even less, but it was good to try it out for future reference.

I also included FontAwesome to get easy access to Twitter icons. I only used 5 of the icons, so I could have found SVGs and used them instead. But FontAwesome icons are really easy to work with so I stuck with that service for now.

## Setup Instructions

### Local Setup

You'll need to use your own Twitter API credentials to run the app locally. Once you have those, put them into your `.bash_profile` like the below:

```
export CONSUMER_KEY=reallylongstringfromtwitter
export CONSUMER_SECRET=reallylongstringfromtwitter
export ACCESS_TOKEN_KEY=reallylongstringfromtwitter
export ACCESS_TOKEN_SECRET=reallylongstringfromtwitter
```

The app will then use those environment variables to communicate with the Twitter API.

**To start the app locally, run these commands:**
*Assuming you have Git, Node.js and NPM installed locally. If not, install them first.*

1. `git clone this_repo`
2. `npm install`
3. `node index.js`
4. Go to localhost:5000 in browser

### Remote Setup on Heroku

1. Create a new app on Heroku
2. Install the Heroku toolbelt <https://toolbelt.heroku.com/>
3. `heroku login` --> Follow prompts
4. `cd my_project_directory`
5. `heroku git:remote -a name_of_app`
6. `git add .`
7. `git commit -am "making waves"`
8. `git push heroku master`


