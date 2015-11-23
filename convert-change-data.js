var data = require('./change-data.js');

var cleanData = {};

for(s in data){
    var symbol = data[s];
    cleanData[s] = {};
    for (day in symbol){
        var dateParts = day.split('/');
        var newDate = dateParts[1] + "/" + dateParts[0] + "/" + dateParts[2]
        cleanData[s][newDate] = symbol[day] > 0 ? 1 : 0;
    }
}

console.log(JSON.stringify(cleanData));


