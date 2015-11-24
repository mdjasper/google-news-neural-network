//import data and library
var data = require('./export5.js'),
	changeData = require('./clean-change-data.js'),
	natural = require('natural'),
	tokenizer = new natural.WordTokenizer(),
	stemmer = natural.LancasterStemmer,
	stopwords = require('stopwords').english,
	ignore  = ['aapl', '500', 'month', 'september', 'exxonmoble', 'monday', 'july,', 'friday', 'nysewfc', 'google', 'two', 'york', 'buffet', 'iphone', 'today', 'week', 'nyse', 'market', 'analyst', 'report', 'exxonmoble', 'among', 'brkb', '30', 'chevron', 'second', 'nysexom', 'google', 'four', 'verizon', 'xbox', 'thursday', 'wednesday', 'nysejpm', 'appl', 'apple', 'msft', 'microsoft', 'xom', 'exxon', 'jnj', 'johnson', 'ge', 'general', 'electric', 'wfc', 'wells', 'fargo', 'brk', 'berkshire', 'hathaway', 'berkshir', 'jp', 'when', 'say', 'firm', 'nysejnd', 'nysepf', 'nasdaq', 'nasdaqaapl', 'nasdaqmsft', '2015', 'it', 'corp', 'at', 'jpm', 'morgan', 'at%26t', 'at&t', 'pfe', 'pfizer', 'pfiz', 'company', 'jpmorgan', 'jpmorg'];

//hooks library functions to string prototype
stemmer.attach(); 

console.time('Combine Strings')
//combine all data for each row into one string
var combined = '';
for(d in data){
	if(data[d].symbol != 'brk') {
		var headlines = data[d].headlines.join();
		var bodies = data[d].bodies.join();
		var str = [].concat(headlines, bodies).toString().replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").toLowerCase();
		combined += str;
	}
}
console.timeEnd('Combine Strings');


console.time('Clean & Tokenize');
//remove stop words

combined = combined.split(' ').filter(function(word){return (!~stopwords.indexOf(word))||(!~ignore.indexOf(word))}).join(' ');

//create an array of tokens
var tokens = combined.tokenizeAndStem();
console.timeEnd('Clean & Tokenize');

console.time('Count and sort Tokens');
//count occurances of unique tokens
var counts = {};
tokens.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });

// transform into a array of counted tokens
// and remove ignore words
var countsArray = [];
for(c in counts){
	if(ignore.indexOf(c) < 0){
		countsArray.push({key: c, value: counts[c]});
	}
}


//sorted to find highest count and to remove upper and lower tokens
countsArray.sort(function(a,b) {
  if (a.value < b.value)
    return -1;
  if (a.value > b.value)
    return 1;
  return 0;
});

//console.log(countsArray);
console.timeEnd('Count and sort Tokens');


console.time('Select Tokens');
//Remove the highest and least used tokens
var percent = 0.05,
	min = 0,
	max = countsArray[countsArray.length-1].value,
	lowerBound = Math.floor(max * percent),
	upperBound = Math.floor(max - (max*percent));

filtered = countsArray.filter(function(value){
	return value.value > lowerBound && value.value < upperBound;
});

var dict = [];
filtered.forEach(function(d){
	dict.push(d.key);
});
console.timeEnd('Select Tokens');

console.log(dict);

console.time('Build Training Data');
var trainingData = [];


for(e in data) {
	var entry = data[e];

	var signature = [];
	var sigSource = [].concat(entry.headlines, entry.bodies).toString().replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").toLowerCase().tokenizeAndStem();
	var features = [];
	dict.forEach(function (d) {
		if (sigSource.indexOf(d) > -1) {
			signature.push(1);
			features.push(d);
		}
		else {
			signature.push(0)
		}
	});

	var symbol = entry.symbol;
	var date = entry.date;
	var change = changeData[symbol][date];

	if(change === 1 || change === 0){
		trainingData.push({
			input: signature,
			output: { 'direction': change}
		});
	}
}

console.timeEnd('Build Training Data');

console.time('Write File');

//console.log(JSON.stringify((trainingData)));

require('fs').writeFile(

	'./training.js',

	JSON.stringify(trainingData),

	function (err) {
		if (err) {
			console.error('Crap happens');
		}
	}
);

console.timeEnd('Write File');