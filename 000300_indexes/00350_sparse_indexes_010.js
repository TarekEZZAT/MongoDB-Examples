//Sparse Indexes

/*
Prepare data
batch
mongoimport --db crud --collection tourists --type csv --headerline --file G:/data/_Datasets/tourists/tourists.csv
*/

//  Check the total number of documents in tourists collection

db.tourists.count()  // should return 100000.

//  Check the total number of documents in tourists collection 
//  without the language field:

 db.tourists.find({language: {$eq:null}}).count()
 db.tourists.find({language: {$eq:""}}).count() // should return 12704.

//  Create a sparse index on the document:

db.tourists.createIndex({language:1}, {sparse: true})


You should see output similar to this:

{
    "createdCollectionAutomatically" : false,
   "numIndexesBefore" : 1,
    "numIndexesAfter" : 2,
    "ok"   : 1
 }


//   Check indexes got created with the sparse parameter:

 db.tourists.getIndexes()

/*
The preceding command should give you output similar to this:

[
  {
    "key": {
      "_id": 1
    },
    "name": "_id_",
    "ns": "test.tourists",
    "v": 2
  },
  {
    "key": {
      "language": 1
    },
    "name": "language_1",
    "ns": "test.tourists",
    "sparse": true, 
    "v": 2
  }
]
*/

//  Run a simple find query:

db.tourists.find({language: 'French'}).explain('executionStats')['executionStats']

/*

The preceding command should give you output similar to this:

    "executionStages": {
        "advanced": 893,
        "alreadyHasObj": 0,
        "docsExamined": 893,
        "executionTimeMillisEstimate": 0,
        "inputStage": {
            "advanced": 893,
            "direction": "forward",
            "dupsDropped": 0,
            "dupsTested": 0,
            "executionTimeMillisEstimate": 0,
            "indexBounds": {
                "language": [
                    "[\"French\", \"French\"]"
                ]
            },
            "indexName": "language_1",
            "indexVersion": 2,
            "invalidates": 0,
            "isEOF": 1,
            "isMultiKey": false,
            "isPartial": false,
            "isSparse": true,
            "isUnique": false,
            "keyPattern": {
                "language": 1
            },
            "keysExamined": 893,
            "multiKeyPaths": {
                "language": []
            },
            "nReturned": 893,
            "needTime": 0,
            "needYield": 0,
            "restoreState": 6,
            "saveState": 6,
            "seeks": 1,
            "seenInvalidated": 0,
            "stage": "IXSCAN",
            "works": 894
        },
        "invalidates": 0,
        "isEOF": 1,
        "nReturned": 893,
        "needTime": 0,
        "needYield": 0,
        "restoreState": 6,
        "saveState": 6,
        "stage": "FETCH",
        "works": 894
    }, 
    "executionSuccess": true,
    "executionTimeMillis": 1,
    "nReturned": 893,
    "totalDocsExamined": 893,
    "totalKeysExamined": 893
} 


For this example, we have picked a sparsely populated field, language, which does not exist in all documents of our sample dataset. In step 1, we can see that
around 12,000 documents do not contain this field. Next, in step 2, we create an index with the optional parameter {sparse: true} which tells MongoDB server to create a sparse index on our field, language. The index gets created and works just like any other index as seen in steps 3 and step 4, respectively.

*/
