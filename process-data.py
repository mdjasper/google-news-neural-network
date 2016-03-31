from sklearn.feature_extraction.text import CountVectorizer
import json, csv, string

with open('./data-exports/export5.js') as data_file:
	data = json.load(data_file)

#
#	Feature List
#	
#	0. sentiment score
#	1. 
#


# Stop word list
stopWords = set(line.strip() for line in open('./stop-words.txt'))

# Build sentiment dictionary from word list
# http://www2.imm.dtu.dk/pubdb/views/publication_details.php?id=6010

sentimentDict = {}

with open('./sentiment-dictionary.tsv') as tsv:
    for line in csv.reader(tsv, delimiter='\t'):
    	sentimentDict[line[0]] = line[1]


def find_ngrams(input_list, n):
 return zip(*[input_list[i:] for i in range(n)])


punctuation = set(string.punctuation)
punctuation.update(['1','2','3','4','5','6','7','8','9','0'])

bgc = {}

for row in data:
	row = data[row]

	#join text into one string
	text = ' '.join(row['bodies']) + ' ' + ' '.join(row['headlines'])
	text = text.lower()
	
	#remove punctuation
	text = ''.join(i for i in text if i not in punctuation)

	#split words into array and remove stop words
	text = ' '.join(i for i in text.split() if i not in stopWords)
	
	for bg in find_ngrams(text.split(), 3):
		bg = ','.join(bg)
		bgc[bg] = bgc[bg] + 1 if bg in bgc else 1



for key, value in sorted(bgc.iteritems(), key=lambda (k,v): (v,k), reverse=True):
    print "%s: %s" % (key, value)

