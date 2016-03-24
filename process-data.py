from sklearn.feature_extraction.text import CountVectorizer
import json

with open('./data-exports/export5.js') as data_file:
	data = json.load(data_file)

for key in data:
	article = data[key]
	