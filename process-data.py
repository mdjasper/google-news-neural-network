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
#
#
#

# Stop word list
stopWords = []
with open('./stop-words.txt') as sw:
    for word in csv.reader(sw, delimiter='\t'):
    	stopWords.append(word[0])

# Build sentiment dictionary from word list
# http://www2.imm.dtu.dk/pubdb/views/publication_details.php?id=6010

sentimentDict = {}

with open('./sentiment-dictionary.tsv') as tsv:
    for line in csv.reader(tsv, delimiter='\t'):
    	sentimentDict[line[0]] = line[1]

#
#def find_ngrams(input_list, n):
#  return zip(*[input_list[i:] for i in range(n)])
#

punctuation = set(string.punctuation)
punctuation.update(['1','2','3','4','5','6','7','8','9','0'])

for row in data:
	row = data[row]

	#join text into one string
	text = ' '.join(row['bodies']).lower() + ' ' + ' '.join(row['headlines']).lower()
	#split words into array and remove stop words
	text = ' '.join(token for token in text.split() if token not in stopWords)
	#remove punctuation
	text = ''.join(token for token in text if token not in punctuation)



	print text + '\n'