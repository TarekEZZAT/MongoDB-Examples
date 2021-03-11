/*
mongoimport
Syntax
mongoimport -options

*/ 
Few examples to show you how to use the mongoimport to restore the database.

Review some of the common use options.

$ mongoimport
connected to: 127.0.0.1
no collection specified!
Import CSV, TSV or JSON data into MongoDB.

options:
  -h [ --host ] arg       mongo host to connect to ( <set name>/s1,s2 for sets)
  -u [ --username ] arg   username
  -p [ --password ] arg   password
  -d [ --db ] arg         database to use
  -c [ --collection ] arg collection to use (some commands)
  -f [ --fields ] arg     comma separated list of field names e.g. -f name,age
  --file arg              file to import from; if not specified stdin is used
  --drop                  drop collection first 
  --upsert
  --type= csv|tsv
  
	--upsert insert or update objects that already exist
*/

//2.1 Imports all documents from file “inventory-bk.json” into database.collection named “crud2.inventory2”. All non-exists databases or collections will be created automatically.

mongoimport -d crud -c inventory-all --file inventory-all-bk.json

//2.2 Imports all documents, insert or update objects that already exist (based on the _id).

mongoimport -d crud -c inventory-is --file inventory-is-bk.json --upsert


//2.3 Connect to remote server – mongolab.com, 
  // using username and password, and import the documents from the local file inventory-bk.json into remote MongoDB server.

mongoimport -h id.mongolab.com:47307 -d heroku_app -c inventory -u username123 -p password123 --file inventory-bk.json
