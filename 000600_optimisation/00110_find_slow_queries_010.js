// Finding slow running queries

//1.  Import the sample data into the MongoDB server:
use crud
mongoimport --headerline --ignoreBlanks --type=csv -d crud -c tourists -h local

//2.  Connect to the MongoDB instance and open a MongoDB shell:




3.  Check that the documents are in the right place:

  use crud
switched to db  crud
  db.tourists.count()
//100000


//4.  Enable profiling for slow queries:

  db.setProfilingLevel(1, 20)
//{ "was" : 0, "slowms" : 20, "ok"   : 1  }


//5.  Run a simple find query as follows:

  db.tourists.find({first_name: "Pam"}).count()
//10


//6.  Check the profiling collection:

  db.system.profile.find().pretty()

  /*
 {
        "op" : "command",
        "ns" : "crud.tourists",
        "command" : {
                "count" : "tourists",
                "query" : {
                        "first_name" : "Pam"
                },
                "fields" : {

                }
        },
        "keysExamined" : 0,
        "docsExamined" : 100000,
        "numYield" : 782,
        "locks" : {
                "Global" : {
                        "acquireCount" : {
                                "r" : NumberLong(1566)
                        }
                },
                "Database" : {
                        "acquireCount" : {
                                "r" : NumberLong(783)
                        }
                },
                "Collection" : {
                        "acquireCount" : {
                                "r" : NumberLong(783)
                        }
                }
        },
        "responseLength" : 29,
        "protocol" : "op_command",
        "millis" : 171,
        "planSummary" : "COLLSCAN",
        "execStats" : {
                "stage" : "COUNT",
                "nReturned" : 0,
                "executionTimeMillisEstimate" : 207,
                "works" : 100002,
                "advanced" : 0,
                "needTime" : 100001,
                "needYield" : 0,
                "saveState" : 782,
                "restoreState" : 782,
                "isEOF" : 1,
                "invalidates" : 0,
                "nCounted" : 10,
                "nSkipped" : 0,
                "inputStage" : {
                        "stage" : "COLLSCAN",
                        "filter" : {
                                "first_name" : {
                                        "$eq" : "Pam"
                                }
                        },
                        "nReturned" : 10,
                        "executionTimeMillisEstimate" : 207,
                        "works" : 100002,
                        "advanced" : 10,
                        "needTime" : 99991,
                        "needYield" : 0,
                        "saveState" : 782,
                        "restoreState" : 782,
                        "isEOF" : 1,
                        "invalidates" : 0,
                        "direction" : "forward",
                        "docsExamined" : 100000
                }
        },
        "ts" : ISODate("2018-05-12T17:03:07.796Z"),
        "client" : "127.0.0.1",
        "appName" : "MongoDB Shell",
        "allUsers" : [ ],
        "user" : ""
} 
  
  */

/*
We begin by importing a fairly large dataset using the mongoimport utility, 
as we did in the Working with indexes

Next, in steps 2 and step 3, we start the MongoDB shell 
and check that our documents were inserted.

In step 4, we enable database profiling by running 
the db.setProfilingLevel(1, 20) command. 

Database profiling is a feature available in MongoDB 
that allows you to log slow queries or operations 
and profiling information related to the operation. 
MongoDB allows three profiling levels:

Level 0: Disable database profiling
Level 1: Log slow queries
Level 2: Log slow operations


By default, profiling for all databases is set to level 0. 
This can be confirmed by running the following command:

db.getProfilingStatus()
{ "was" : 0, "slowms" : 100  }

The was field indicates the current profiling level, 
the slowms field indicates the maximum allowed execution time (in milliseconds)
for operations. 
All operations taking longer than the slowms threshold will be recorded
by the database profiler. 

We set the profiling level to 1, 
indicating that we want the profiling level to record only slow queries,
and the second parameter,
20, indicates that any query taking longer than 20 ms should be recorded.

In step 5, we run a simple query 
As this is not an indexed collection, 
the server will have to scan through all documents, 
which hopefully takes more than 20 ms. 
Once the profiler's threshold is crossed (in our case, 20 ms), 
the data is stored in the system.profile collection.

In step 6, we query the system.profile collection to find 
all operations captured by the profiling database. 


Each document in this collection captures a lot of 
information regarding the query. 
A few of them are as follows:

client: The IP address of the connecting client.
appName: This is a string passed by the MongoDB driver 
that can help identify the connecting app. 
It's extremely helpful if you have multiple applications 
talking to the same database. 
In our example, this string was "MongoDB Shell", 
which was set by mongo-shell.
user: The authenticated user who ran the operation. 
This can be empty if no authentication was used.
millis: The time taken, in milliseconds, for the entire operation to finish.
command: The command for the given operation.
ns: The namespace on which the command was run. Its format is <database.
<collection, so in our example it was run on the crud database's tourists
collection.


An exhaustive list can be found in MongoDB's official documentation, 
https://docs. mongodb.com/manual/reference/database-profiler/.
Considering the wealth of information collected by the database profiler,
it should be very easy not only to debug slow queries
but even monitor the collection to alert on patterns
*/


/*
system.profile collection, 
is a capped collection with a size of 1 MB:
*/
db.system.profile.stats()

/*
The result is as follows:

{
     "ns" : "crud.system.profile",
     "size" : 0,
     "count" : 0,
     "numExtents" : 1,
     "storageSize" : 1048576,
     "lastExtentSize" : 1048576,
     "paddingFactor" : 1,
     "paddingFactorNote" : "paddingFactor is unused and   unmaintained in 3.0. It remains
     "userFlags" : 1,
     "capped"  : true,
     "max" : NumberLong("9223372036854775807"),
     "maxSize" : 1048576,
     "nindexes" : 0,
     "totalIndexSize" : 0,
     "indexSizes" : {
     },
     "ok"   : 1
 }


This size may be sufficient for most cases.
*/

/*
If you need to increase the size of this collection, 
here is how to do it.
*/

//First, we disable profiling:

  db.setProfilingLevel(0)
//{ "was" : 1, "slowms" : 100, "ok"   : 1  }



// Next, we drop the system.profile collection 

db.system.profile.drop()

// Create a new capped collection with a size of 10// MB:
*/
  db.createCollection('system.profile', {capped: true, size: 10485760})
//{ "ok"   : 1  }


//Finally, enable profiling:

  db.setProfilingLevel(1,20) 
//{ "was" : 0, "slowms" : 100, "ok"   : 1  }


