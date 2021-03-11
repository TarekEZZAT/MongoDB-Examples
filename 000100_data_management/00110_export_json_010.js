/*
mongoexport
Syntax
mongoexport -options


options:
  -h [ --host ] arg         mongo host to connect to ( <set name>/s1,s2 for 
  -u [ --username ] arg     username
  -p [ --password ] arg     password
  -d [ --db ] arg           database to use
  -c [ --collection ] arg   collection to use (some commands)
  -q [ --query ] arg        query filter, as a JSON string
  -o [ --out ] arg          output file; if not specified, stdout is used
  -type json|csv|tsv
  --queryFile file			file containing query to select the output documents
*/ 


//1.1 Export all documents (all fields) into the file “inventory-all-bk.json“.

mongoexport -d crud -c inventory -o inventory-bk.json

//1.2 Export all documents with fields “item” and “status” only.

mongoexport -d crud -c inventory -f "item,status" -o inventory-is-bk.json

//1.3 Export all documents with a search query, in this case, 
 //only document with “qty > 50” will be exported.

mongoexport --username x --password x --host x --db mydb --collection mycol --query "{ 'Product Info.ProductName':{$exists:true}}" --type=csv --fields id,productid --out "c:\myfile.csv"
mongoexport --host x --db mydb --collection mycol --query "{ 'Product Info.ProductName':{$exists:true}}" --type=csv --fields id,productid --out "c:\myfile.csv"

// db.inventory.find({qty:{$gt:50}})
/* 
gives error
mongoexport -d crud -c inventory -f "item,qty" -q '{"qty":{$gt:50}}' -o inventory-iq-bk.json
*/
mongoexport -d crud -c inventory -f "item,qty" --queryFile 00120_export_json_query.txt -o inventory-iq-bk.json

//1.4 Connect to remote server like mongolab.com, using username and password.

mongoexport -h id.mongolab.com:47307 -d heroku_app -c domain -u username123 -p password123 -o domain-bk.json


/*
Note
With mongoexport, all exported documents will be in json format.
2. Restore database with mongoimport
*/


