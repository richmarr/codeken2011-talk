var https = require('https'),
	events = require('events'),
	querystring = require('querystring'),
	env = require('codeken/env');

var TagEmitter = module.exports.TagEmitter = function( params ){

	events.EventEmitter.call(this);
	var self = this;
	
	// var params = {track:'WhatYouFindInLadiesHandbags,codeken2011'}

	// Basic auth: "stream.twitter.com/1/statuses/filter.json?track="
	https.get({ 
		host:'stream.twitter.com',
		port:443,
		path:'/1/statuses/filter.json?'+querystring.stringify(params),
		headers:{ authorization:new Buffer(env.username+":"+env.password).toString("base64") }
	},function(err,data){
		if ( err ) return "blah";

		data.on('data',function(data){
			var tweetJSON = data.split('\n');
			for ( var i = 0; i < tweetJSON.length; i++ ){
				var tweet = JSON.parse(tweetJSON[i]);
				self.emit('tweet',tweet);
			}
		})
	});

};

TagEmitter.prototype = new events.EventEmitter();









	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	/*var https = require('https'),
	events = require('events'),
	querystring = require('querystring'),
	env = require('codeken/env');

//var TagEmitter = function( options ){
var TagEmitter = module.exports = function( options ){
	
	var self = this;
	events.EventEmitter.call(this);

/ * 	var options = {
		track:'ThingsPeopleShouldntDo'
	};
* /	
	
	https.get({
		host:'stream.twitter.com',
		port:443,
		path:'/1/statuses/filter.json?'+querystring.stringify(options),
		headers:{ authorization:new Buffer(env.username+":"+env.password).toString("base64") }
	},function(res){
	
		res.on('data', function(d) {
			var tweets = splitTweets(d.toString());
			try{ // 
				for ( var i in tweets ){
					var o = JSON.parse(tweets[i]);
					self.emit('tweet',o);
				}
			} catch(e){
				self.emit('error',e);
			}
		});
		
		res.on('error',function(){
			console.error(arguments);
		})
	
	});
}

// X inherits Y
TagEmitter.prototype = new events.EventEmitter();

function splitTweets( str ){
	var splitter = "\\n";
	return str.split(splitter);
}
*/

/*

	count
	-----
	
	Indicates the number of previous statuses to consider for delivery before transitioning to live stream delivery. On unfiltered streams, all considered statuses are delivered, so the number requested is the number returned. On filtered streams, the number requested is the number of statuses that are applied to the filter predicate, and not the number of statuses returned.

	Firehose, Links, Birddog and Shadow clients interested in capturing all statuses should maintain a current estimate of the number of statuses received per second and note the time that the last status was received. Upon a reconnect, the client can then estimate the appropriate backlog to request. Note that the count parameter is not allowed elsewhere, including track, sample and on the default access role.

	Values: -150,000 to 150,000. This range is subject to change on short notice. Positive values transition seamlessly to the live stream. Negative values terminate when the historical stream has finished, useful for debugging.
	Methods: statuses/firehose, statuses/links, statuses/filter


	delimited
	---------
	Indicates that statuses should be delimited in the stream. Statuses are represented by a length, in bytes, a newline, and the status text that is exactly length bytes. Note that “keep-alive” newlines may be inserted before each length.

	Values: length
	Methods: statuses/firehose, statuses/links, statuses/filter, statuses/sample, statuses/retweet

	Example:

	curl https://stream.twitter.com/1/statuses/sample.json?delimited=length -uAnyTwitterUser:Password

	follow
	------
	
	Returns public statuses that reference the given set of users. Users specified by a comma separated list.

	References matched are statuses that were:

	Created by a specified user
	Explicitly in-reply-to a status created by a specified user (pressed reply “swoosh” button)
	Explicitly retweeted by a specified user (pressed retweet button)
	Created by a specified user and subsequently explicitly retweeted by any user
	References unmatched are statuses that were:

	Mentions (“Hello @user!”)
	Implicit retweets (“RT @user Says Helloes” without pressing a retweet button)
	Implicit replies (“@user Hello!”, created without pressing a reply “swoosh” button to set the in_reply_to field)
	Values: user IDs (integers), separated by commas.
	Methods: statuses/filter

	Example: 
	Create a file called ‘following’ that contains, exactly and excluding the quotation marks: “follow=12,13,15,16,20,87” then execute:

	curl -d @following https://stream.twitter.com/1/statuses/filter.json -uAnyTwitterUser:Password.
	You will receive JSON updates from Jack Biz, Crystal, Ev, Krissy, but not from Jeremy, as he’s a private user.

	track
	-----
	
	Specifies keywords to track. Phrases of keywords are specified by a comma-separated list. Queries are subject to Track Limitations, described in Track Limiting and subject to access roles, described in the statuses/filter method.

	Comma separated keywords and phrases are logical ORs, phrases are logical ANDs. Words within phrases are delimited by spaces. A tweet matches if any phrase matches. A phrase matches if all of the words are present in the tweet. (e.g. ‘the twitter’ is the AND twitter, and ‘the,twitter’ is the OR twitter.). Terms are exact-matched, and also exact-matched ignoring punctuation. Each comma-separated term may be up to 60 characters long.

	Exact matching on phrases, that is, keywords with spaces, is not supported. Keywords containing punctuation will only exact match tokens and, other than keywords prefixed by # and @, will tend to never match. Non-space separated languages, such as CJK and Arabic, are currently unsupported as tokenization only occurs on whitespace and punctuation. Other UTF-8 phrases should exact match correctly, but will not substitute similar characters to their least-common-denominator. For all these cases, consider falling back to the Search REST API.

	Track examples:

	Twitter will match: TWITTER, twitter, “Twitter”, twitter., #twitter, @twitter and http://twitter.com.
	Twitter will not match: TwitterTracker or #newtwitter.
	helm's-alee will match: helm’s-alee
	helm's-alee will not match: #helm’s-alee
	twitter api,twitter streaming will match: “The Twitter API is awesome” and “The twitter streaming deal is fast”. and “The Streaming API that Twitter has is great”.
	twitter api,twitter streaming will not match: “I’m new to Twitter”.
	Values: Strings separated by commas. Each string must be between 1 and 60 bytes, inclusive.
	Methods: statuses/filter

	Example: 
	Create a file called ‘tracking’ that contains, excluding the quotation marks, the phrase: “track=basketball,football,baseball,footy,soccer” then execute:

	curl -d @tracking https://stream.twitter.com/1/statuses/filter.json -uAnyTwitterUser:Password.
	You will receive JSON updates about various crucial sportsball topics and events.


	locations
	---------
	Specifies a set of bounding boxes to track. Only tweets that are both created using the Geotagging API and are placed from within a tracked bounding box will be included in the stream – the user’s location field is not used to filter tweets (e.g. if a user has their location set to “San Francisco”, but the tweet was not created using the Geotagging API and has no geo element, it will not be included in the stream). Bounding boxes are specified as a comma separate list of longitude/latitude pairs, with the first pair denoting the southwest corner of the box. For example locations=-122.75,36.8,-121.75,37.8 would track tweets from the San Francisco area. Multiple bounding boxes may be specified by concatenating latitude/longitude pairs, for example: locations=-122.75,36.8,-121.75,37.8,-74,40,-73,41 would track tweets from San Francisco and New York City.

	Just as with the track parameter, queries are subject to Track Limitations, described in Track Limiting and subject to access roles, described in the statuses/filter method. Both the number and size of bounding boxes is limited. Bounding boxes can be up to 360 degrees longitude by 180 degrees latitude, and you may specify up to 25 bounding boxes. A box of 360-degrees by 180-degrees will cover the whole earth. Higher access levels provide additional bounding boxes.

	Bounding boxes are logical ORs. A locations parameter may be combined with track parameters, but note that all terms are logically ORd, so the query string track=twitter&amp;amp;locations=-122.75,36.8,-121.75,37.8 would match any tweets containing the term Twitter (even non-geo tweets) OR coming from the San Francisco area.

	Values: longitude/latitude pairs, separated by commas. The first pair specifies the southwest corner of the box.
	Methods: statuses/filter

	Example: 
	Create a file called ‘locations’ that contains, excluding the quotation marks, the phrase: “locations=-122.75,36.8,-121.75,37.8,-74,40,-73,41” then execute:

	curl -d @locations https://stream.twitter.com/1/statuses/filter.json -uAnyTwitterUser:Password.
	You will receive all geo tagged tweets from the San Francisco and New York City area.

*/