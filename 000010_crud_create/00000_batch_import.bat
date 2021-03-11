Import CSV

'    Either make sure the first line of your data.csv file has field names of the data to be parsed and then execute:
mongoimport --db users --collection contacts --type csv --headerline --file data.csv

'    Or
'    Define the list of field names that the values of csv would be parsed in using --fields
mongoimport --db users --collection contacts --type csv --file data.csv --fields["name","surname","etc"]

