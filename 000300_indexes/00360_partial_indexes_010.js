//Partial indexes  


use crud

//  Create an index on the city field, 

//  Check the total number of documents

db.tourists.count()

//  Check the total number of documents
//  without the language field:

db.tourists.count({language: {$eq:""}})
// or
db.tourists.count({language: {$eq:null}})





//  Create a sparse index on the document:

db.tourists.createIndex(
 {first_name:1},
 {partialFilterExpression: { language: {$exists: true}}}
)

/*
This should give you output similar to this:

{
    "createdCollectionAutomatically" : false,
    "numIndexesBefore" : 1,
    "numIndexesAfter" : 2,
    "ok"   : 1
}
*/

//  Confirm that the index was created:

db.tourists.getIndexes()

/*
The preceding command should give you output similar to this:

[
  {
    "key": {
      "_id": 1
    },
    "name": "_id_",
    "ns": "crud.tourists",
    "v": 2
  },
  {
    "key": {
      "first_name": 1
    }, 
    "name": "first_name_1",
    "ns": "crud.tourists",
    "partialFilterExpression": {
      "language": {
        "$exists": true
      }
    },
    "v": 2
  }
]
*/

//  Find a record without language field:

db.tourists.find({first_name: 'Sara'}).explain('executionStats')['executionStats']

/*
The preceding command should give you output similar to this:

{
  "executionStages": {
    "advanced": 7,
    "direction": "forward",
    "docsExamined": 100000,
    "executionTimeMillisEstimate": 21,
    "filter": {
      "first_name": {
        "$eq": "Sara"
      }
    },
    "invalidates": 0,
    "isEOF": 1,
    "nReturned": 7,
    "needTime": 99994,
    "needYield": 0,
    "restoreState": 782,
    "saveState": 782,
    "stage": "COLLSCAN",
    "works": 100002
  },
  "executionSuccess": true,
  "executionTimeMillis": 33,
  "nReturned": 7,
  "totalDocsExamined": 100000,
  "totalKeysExamined": 0
}
*/

//  Find a record with language field:

db.tourists.find({first_name: 'Sara', language: 'Spanish'}).explain('executionStats')['executionStats']

/*
The preceding command should give you output similar to this:

{
  "executionStages": {
    "advanced": 1,
    "alreadyHasObj": 0,
    "docsExamined": 7,
    "executionTimeMillisEstimate": 0,
    "filter": { 
      "language": {
        "$eq": "Spanish"
      }
    },
    "inputStage": {
      "advanced": 7,
      "direction": "forward",
      "dupsDropped": 0,
      "dupsTested": 0,
      "executionTimeMillisEstimate": 0,
      "indexBounds": {
        "first_name": [
          "[\"Sara\", \"Sara\"]"
        ]
      },
      "indexName": "first_name_1",
      "indexVersion": 2,
      "invalidates": 0,
      "isEOF": 1,
      "isMultiKey": false,
      "isPartial": true,
      "isSparse": false,
      "isUnique": false,
      "keyPattern": {
        "first_name": 1
      },
      "keysExamined": 7,
      "multiKeyPaths": {
        "first_name": []
      },
      "nReturned": 7,
      "needTime": 0,
      "needYield": 0,
      "restoreState": 0,
      "saveState": 0,
      "seeks": 1,
      "seenInvalidated": 0,
      "stage": "IXSCAN",
      "works": 8
    },
    "invalidates": 0,
    "isEOF": 1,
    "nReturned": 1,
    "needTime": 6,
    "needYield": 0,
    "restoreState": 0,
    "saveState": 0,
    "stage": "FETCH",
    "works": 8
  },
  "executionSuccess": true,
  "executionTimeMillis": 0,
  "nReturned": 1,
  "totalDocsExamined": 7,
  "totalKeysExamined": 7
}

  


we have picked a sparsely populated field, language, 
which does not exist in all documents of our sample dataset. 

we can see that around 12,000 documents do not contain this field.

we create an index on the field first_name 
with the optional parameter partialFilterExpression. 
With this parameter, we have added a condition
{ language: {$exists: true}}. 

MongoDB is instructed to create an index on first_name 
ONLY on documents which have the field language present. 

we can observe that the index is not used 
if we do a simple search on the field first_name. 

we can see that our query is using the MongoDB index
if we add an additional parameter of the field language.

some more examples at https:
//docs.mongodb.com/manual/core/index-partial/.


So why would one use a partial index? Say, for example, you have a huge dataset and wish to have an index on a field which is sparsely spread across these documents. Traditional indexes would cause the entire collection to be indexed and may not be optimal if we are going to work on a subset of these documents. 
*/
