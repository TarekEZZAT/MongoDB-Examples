/*
TTL (Time To Live) indexes
(expireAfterSeconds Indexes) 

The expireAfterSeconds property of MongoDB indexes
allows automatic deletion of documents from a collection. 
*/


use crud


1. Ensure that our collection is empty:

db.ttldata.drop()

/*
make a js file generating 200 random documebts
00330_TTL_indexes_010_generate_data.js



for(var x=1; x<=100; x++){
  var past =  new Date()
  past.setSeconds(past.getSeconds() - (x *  60))
  // Insert a  document with timestamp in the past
  var  doc =  {
    foo: 'bar',
    timestamp: past
  }
  db.ttldata.insert(doc)
  // Insert a  document with timestamp in the future
  var future =  new Date()
  future.setSeconds(future.getSeconds() +  (x *  60))
  var  doc =  {
    foo: 'bar',
    timestamp: future
  }
  db.ttldata.insert(doc)
}
*/

//2.  Add 200 random documents:
load("00330_TTL_indexes_010_generate_data.js")

//3.  Check that the documents were added:

db.ttldata.count()


//4.  Create an index with TTL:

db.ttldata.createIndex({timestamp:1}, {expireAfterSeconds: 10})

/*
You should see output similar to this: 
{ "createdCollectionAutomatically" : false, 
"numIndexesBefore" : 1, 
"numIndexesAfter" : 2,
"ok" : 1
}
*/

//5.  Wait for about a minute and check the document count:

 db.ttldata.count() 

/* 
The number of documents returned should be lower than 200.
*/

  

/*
In step 1, we emptied the ttldata collection
Next, in step 2, we ran a simple JavaScript code that adds 200 records,
each having a BSON Date() field called timestamp. 
We added about 100 records in the past and 100 in the future 
each 1 minute in the past and future respectively.

Then in step 3, we created a regular index but with an additional parameter
{expireAfterSeconds: 10}. In this, we are telling the server to expire documents 10 seconds from the value of time mentioned in our timestamp field. Once this is added, you can check that the number of documents in the collection has reduced from 200 to, in this case, 113 and counting. What happens here is that there is a background thread in MongoDB server that wakes up every minute and removes any document that matches our index's condition. At this point, I would like to point out that if our field timestamp were not a valid Date() function or an array of Date() function, then no documents would be removed.
*/
  