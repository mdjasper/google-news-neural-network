var brain = require('brain'),
    data = require('./training.js');

for(var i = 80; i > 0; i -= 0.5) {

    var net = new brain.NeuralNetwork();

    var trainingData = [],
        testingData = [];

//console.time('divide dataset');

    data.forEach(function (row) {
        if (Math.random() > i/100) {
            trainingData.push(row);
        } else {
            testingData.push(row);
        }
    });
    if(trainingData.length > 0) {
        console.log(i);

        console.log('Training Size: ' + trainingData.length);
//console.log('Test Size: ' + testingData.length);

//console.timeEnd('divide dataset');

        console.time('train network');

        net.train(trainingData);

        console.timeEnd('train network');
    }


//console.time('run test data');

    //var correct = 0,
    //    total = 0;
    //
    //testingData.forEach(function (row) {
    //    var outcome = net.run(row.input);
    //    //console.log(row.output.direction + ": " + outcome.direction)
    //    if (Math.round(outcome.direction) == row.output.direction) {
    //        correct += 1;
    //    }
    //    total += 1;
    //})

//console.log('Correct: ' + correct);
//console.log('total: ' + total);

//console.log('ratio: ' + correct/total);

//console.timeEnd('run test data');
console.log('---');
}