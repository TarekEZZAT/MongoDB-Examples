// Unique Indexes 

//    We only need a running mongod instance. 


//  Connect to the mongo shell and insert a random document:

use crud
db.uniqueIndexed.insert({uniqueKey: 'uniqueValue'})


//  Create an index with the unique parameter:

db.uniqueIndexed.createIndex({uniqueKey:1}, {unique:1})

/*
The preceding command should give you an output similar to this:

{
  "createdCollectionAutomatically": false,
  "numIndexesAfter": 2,
  "numIndexesBefore": 1,
  "ok": 1
}
*/

//  Tadd another document with a duplicate value of the field:

db.uniqueIndexed.insert({uniqueKey: 'uniqueValue'})

/*
The preceding command should give you an error message similar to this:

WriteResult({
  "nInserted" : 0,
  "writeError" : {
    "code"  : 11000,
    "errmsg" : "E11000 duplicate key error  collection: mydb.uniqueIndexed index: uniqueKey
  }
})
*/

//  Drop the index:

db.uniqueIndexed.dropIndexes()


//  Add a duplicate record: 
db.uniqueIndexed.insert({uniqueKey: 'uniqueValue'})
db.uniqueIndexed.find()

/*
The preceding command should give you an output similar to this:

{ "_id" : ObjectId("59490cabc14da1366d83254f"), "uniqueKey" : "uniqueValue" }
{ "_id" : ObjectId("59490d20c14da1366d832551"), "uniqueKey" : "uniqueValue" }
*/

//  Try creating the index again:

db.uniqueIndexed.createIndex({uniqueKey:1}, {unique:1})

/*
The preceding command should give you an output similar to this:

{
  "ok"   : 0,
  "errmsg" : "E11000 duplicate key error  collection: mydb.uniqueIndexed index: uniqueKey_1
  "code"  : 11000,
  "codeName" : "DuplicateKey"
}
*/

 