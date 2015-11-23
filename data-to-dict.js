var data = require('./google-news-2-export.js');

var combined = [], tokens = [], dict = [], filtered = [];

//combine all data for each row into one string
for(d in data){
	var headlines = data[d].headlines.join();
	var bodies = data[d].bodies.join();
	var str = [].concat(headlines, bodies).toString().replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").toLowerCase();
	combined.push([].concat(str).join());
}

//push split strings to array of individual words
for(c in combined){
	words = combined[c].split(' ');
	for(w in words){
		tokens.push(words[w]);
	}
}

tokens.forEach(function(x){
	dict[x] = (dict[x] || 0) + 1;
})

//filter out dict words that have too many or few occurences
for(d in dict){
	if(dict[d]>10&&dict[d]<40) filtered.push({key:d, count:dict[d]});
}
console.log(filtered);
console.log(filtered.length);