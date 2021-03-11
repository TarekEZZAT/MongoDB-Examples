//Multiple operations on replicas with write concern of "majority" and timeout

try {
   db.enemies.bulkWrite(
      [
         { updateMany :
            {
               "filter" : { "rating" : { $gte : 3} },
               "update" : { $inc : { "encounter" : 0.1 } }
            },
		 },
         { updateMany :
            {
               "filter" : { "rating" : { $lt : 2} },
               "update" : { $inc : { "encounter" : -0.25 } }
            },
         },
         { deleteMany : { "filter" : { "encounter" { $lt : 0 } } } },
         { insertOne :
            {
               "document" :
                  {
                     "_id" :5, "char" : "ogrekin" , "rating" : 2, "encounter" : 0.31
                  }
            }
         }
      ],
      { 
	  writeConcern : { w : "majority", wtimeout : 100 } 
      }
   );
}
catch (e) {
   print(e);
}

/* If the total time required for all required nodes in the replica
 set to acknowledge the write operation is greater than wtimeout, 
 the following writeConcernError is displayed 
 when the wtimeout period has passed.


BulkWriteError({
   "writeErrors" : [ ],
   "writeConcernErrors" : [
      {
         "code" : 64,
         "errInfo" : {
            "wtimeout" : true
         },
         "errmsg" : "waiting for replication timed out"
      }
   ],
   "nInserted" : 1,
   "nUpserted" : 0,
   "nMatched" : 4,
   "nModified" : 4,
   "nRemoved" : 1,
   "upserted" : [ ]
   })

 The result set shows the operations executed since writeConcernErrors errors
 are not an indicator that any write operations failed.
*/