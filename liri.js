var keys = require("./keys.js");
var command = process.argv[2];
var search = process.argv.slice(3).join("+");
var fs = require("fs");
var request = require("request");
var spotify = require("spotify");
var Twitter = require("twitter");
var queryMovie = "http://www.omdbapi.com/?t=" + search + "&y=&plot=short&r=json&tomatoes=true";
var count = 0;

var twitKeys = new Twitter({
  consumer_key: keys.consumer_key,
  consumer_secret: keys.consumer_secret,
  access_token_key: keys.access_token_key,
  access_token_secret: keys.access_token_secret
});

function liriBot(command) {
	switch (command) {
	case "my-tweets":
		tweet();
		break;
	case "spotify-this-song":
		song();
		break;
	case "movie-this":
		movie();
		break;
	case "do-what-it-says":
		doThis();
		break;
	default:
		console.log("Sorry! Command not found. Please use one of the following commands:\nmy-tweets, spotify-this-song, movie-this, or do-what-it-says")
	}
}

// ============================================================================================
// node liri.js my-tweets
// ============================================================================================
// This will show your last 20 tweets and when they were created at in your terminal/bash window.

function tweet() {
	if (count<20){
		twitKeys.get('favorites/list', { screen_name: 'rjrowland' }, function(err, tweets, response) {
		console.log("Tweet #"+(count+1)+": "+tweets[0].text);
		console.log("Created: "+tweets[0].created_at);
		count++;
		if (count >= 20) {
			count = 0;
		}
	});
  }	
}

// ============================================================================================
// node liri.js spotify-this-song '<song name here>'
// ============================================================================================

function song() {
// This will show the following information about the song in your terminal/bash window
	// Artist(s)
	// The song's name
	// A preview link of the song from Spotify
	// The album that the song is from
		// if no song is provided then your program will default to
		// "The Sign" by Ace of Base}

	if (search === "") {
	search = "the sign";
	spotify.search({ type: 'track', query: '"' + search + '"', limit: 1 }, function(err, data) {
    if ( err ) {
        console.log('Error occurred: ' + err);
        return;
    }
	    console.log("Artist: " + JSON.stringify(data.tracks.items[0].artists[0].name, null, 2));
	    console.log("Song: " + JSON.stringify(data.tracks.items[0].name, null, 2));
	    console.log("Preview: " + JSON.stringify(data.tracks.items[0].preview_url, null, 2));
	    console.log("Album: " + JSON.stringify(data.tracks.items[0].album.name, null, 2));
	});
} else {
	spotify.search({ type: 'track', query: '"' + search + '"', limit: 1 }, function(err, data) {
    if ( err ) {
        console.log('Error occurred: ' + err);
        return;
    }
	    console.log("Artist: " + JSON.stringify(data.tracks.items[0].artists[0].name, null, 2));
	    console.log("Song: " + JSON.stringify(data.tracks.items[0].name, null, 2));
	    console.log("Preview: " + JSON.stringify(data.tracks.items[0].preview_url, null, 2));
	    console.log("Album: " + JSON.stringify(data.tracks.items[0].album.name, null, 2));
	});
  }
}

// ============================================================================================
// node liri.js movie-this '<movie name here>'
// ============================================================================================
// This will output the following information to your terminal/bash window:
	// Title of the movie.
	// Year the movie came out.
	// IMDB Rating of the movie.
	// Country where the movie was produced.
	// Language of the movie.
	// Plot of the movie.
	// Actors in the movie.
	// Rotten Tomatoes Rating.
	// Rotten Tomatoes URL.
	// If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'

function movie() {
if (search === ""){
	search = "Mr.Nobody";
	queryMovie = "http://www.omdbapi.com/?t=" + search + "&y=&plot=short&r=json";
	request(queryMovie, function(error, response, body) {

	  if (!error && response.statusCode === 200) {
	  	console.log("Title: " + JSON.parse(body).Title);
	  	console.log("Release: " + JSON.parse(body).Released);
	  	console.log("Rated: " + JSON.parse(body).Rated);
	  	console.log("Country: " + JSON.parse(body).Country);
	  	console.log("Language: " + JSON.parse(body).Language);
	  	console.log("Plot: " + JSON.parse(body).Plot + ".");
	  	console.log("Actors: " + JSON.parse(body).Actors);
	  	console.log("IMDb Rating: " + JSON.parse(body).imdbRating);
	  	console.log("Tomatometer: " + JSON.parse(body).tomatoRating);
	  	console.log("Rotten Tomatoes Link: " + JSON.parse(body).tomatoURL);
	  	}
	  });
} else {
	request(queryMovie, function(error, response, body) {

	  if (!error && response.statusCode === 200) {
	  	console.log("Title: " + JSON.parse(body).Title);
	  	console.log("Release: " + JSON.parse(body).Released);
	  	console.log("Rated: " + JSON.parse(body).Rated);
	  	console.log("Country: " + JSON.parse(body).Country);
	  	console.log("Language: " + JSON.parse(body).Language);
	  	console.log("Plot: " + JSON.parse(body).Plot + ".");
	  	console.log("Actors: " + JSON.parse(body).Actors);
	  	console.log("IMDb Rating: " + JSON.parse(body).imdbRating);
	  	console.log("Tomatometer: " + JSON.parse(body).tomatoRating);
	  	console.log("Rotten Tomatoes Link: " + JSON.parse(body).tomatoURL);
	  	}
	  });
	}
}

// ============================================================================================
// node liri.js do-what-it-says
// ============================================================================================
// Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
// It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
// Feel free to change the text in that document to test out the feature for other commands.

function doThis() {
	fs.readFile('random.txt', 'utf-8', function(err, data) {
	  if (err) {
	  	console.log(err);
	  } else {
	  	newData = data.split(",");
	  	command = newData[0];
	  	search = newData[1];
	  	liriBot(command);
	}
  });
}

// ============================================================================================
// BONUS
// ============================================================================================
// In addition to logging the data to your terminal/bash window, output the data to a .txt file called log.txt.

// Make sure you append each command you run to the log.txt file.

// Do not overwrite your file each time you run a command.
function log() {
	fs.appendFile('log.txt', tweet(), 'utf-8', (err) => {
	  if (err) throw err;
	  console.log(command);
	});
}

liriBot(command);
log();