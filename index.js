var GoogleNews = new require('google-news'),
	googleNews = new GoogleNews({
		params:{
			tbs: 'cdr:1,cd_min:9/1/2010,cd_max:9/1/2010'
		}
	}),
	sqlite = require('sqlite3').verbose(),
	db = new sqlite.Database('news.db'),
	query = process.argv[2],
	date = process.argv[3];

db.serialize(function(){
	db.run('CREATE TABLE IF NOT EXISTS raw (headline TEXT, query TEXT)');
	var stmt = db.prepare('INSERT INTO raw VALUES (?, ?)');

	googleNews.stream(query, function(stream) {
	  
	  stream.on(GoogleNews.DATA, function(data) {
	    stmt.run(data.title, query);
	    return console.log('data saved.')
	  });
	  
	  stream.on(GoogleNews.ERROR, function(error) {
	    return console.log('Error Event received... ' + error);
	  });
	});
});