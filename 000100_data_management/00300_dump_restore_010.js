// Copy collection from db to db

/*
Step 1
mongodump -d some_database -c some_collection
*/

mongodump -d SampleCollections -c Sakila_actors
mongodump -d SampleCollections -c Sakila_customers
mongodump -d SampleCollections -c Sakila_films

/*
 [Optionally, zip the dump 
 (zip some_database.zip some_database/* -r) and scp it elsewhere]
*/

/* Step 2
Restore it:
mongorestore -d some_other_db -c some_or_other_collection dump/some_collection.bson
Existing data in some_or_other_collection will be preserved. That way you can "append" a collection from one database to another.

you can disable restore indexes with --noIndexRestore.
*/

mongorestore -d sakila 

mongorestore -d sakila -c actors dump/SampleCollections/Sakila_actors.bson
mongorestore -d sakila -c customers dump/SampleCollections/Sakila_customers.bson
mongorestore -d sakila -c films dump/SampleCollections/Sakila_films.bson

