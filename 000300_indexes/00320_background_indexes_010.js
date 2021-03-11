Background indexes

/*
drop all indexes
*/
use sakila
db.films.dropIndexes()

/*
Tests
qDoc = query document
pDoc = projection document
*/
qDoc = {}
pDoc = {'Category':1}
db.films.find({},pDoc).pretty()
//
qDoc = {Category:"Documentary", Rating:"PG"}
db.films.find(qDoc).pretty()


qDoc = {Category:"Documentary", Rating:"PG", 'Replacement Cost':{$gt:"20"}}
db.films.find(qDoc).pretty()


//  $or:[{Category:"Documentary"},{Category:"Music"},{Category:"Classics"}]
qDoc = {$or:[{Category:"Documentary"},{Category:"Music"},{Category:"Classics"}], Rating:"PG", 'Replacement Cost':{$gt:"20"}}
pDoc = {Category:1, Rating:1, "Replacement Cost":1}

// Execute
db.inventory.find(qDoc,pDoc)
db.inventory.find(qDoc,pDoc).explain("executionStats")


/*
Create index
*/

/*
1.  Open two mongo shells, we will create an index in one while we do an insert query in another. 
2.  Ensure you've selected sakila by executing the command use sakila in both windows.
3.  In the first mongo shell, create an index and immediately shift to the second shell:
*/

		
db.films.createIndex({Category:1, Rating:1, "Replacement Cost":1})

/*
4.  In the second shell window, perform a simple insert operation:
*/
  db.sakila.insert({info:'test'})
/*
You should see the following output: WriteResult({ "nInserted" : 1 })
*/

/*
5.  Check the mongod server logs:

2017-06-13T03:54:26.296+0000 I INDEX [conn1] build index on: sakila.films prop
2017-06-13T03:54:26.297+0000 I INDEX [conn1] building index using bulk method; 
 2017-06-13T03:54:36.575+0000 I INDEX [conn1] build index done. scanned 2100001
 2017-06-13T03:54:36.576+0000 I COMMAND [conn2] command sakila.films appName: 
 2017-06-13T03:54:36.577+0000 I COMMAND   [conn1] command sakila.$cmd appName: "Mon
*/

/*
6.  Now drop the indexes and get ready to repeat steps 1 to 5 again.
*/
db.films.dropIndexes()

/*
7.  In the first mongo shell window, recreate the index. As this command will 
take some time, switch to the second shell window:
*/
db.films.createIndex({Category:1, Rating:1, "Replacement Cost":1}, {background:1})

/*
8.  In the second shell window, perform an insert operation, this time it should immediately yield:
*/
db.sakila.insert({info:'test2'})

/*
You should see the following output: WriteResult({ "nInserted" : 1 })
*/

/*
9.  Look at the mongod server logs:

2017-06-13T04:00:29.248+0000 I INDEX [conn1] build index on: akila.films prop
2017-06-13T04:00:32.008+0000 I - [conn1] Index Build (background): 397400/22000
 2017-06-13T04:00:35.002+0000 I - [conn1] Index Build (background): 673800/2200
 2017-06-13T04:00:38.009+0000 I - [conn1] Index Build (background): 762300/2200
 2017-06-13T04:00:41.006+0000 I - [conn1] Index Build (background): 903400/2200
 <<  --- output snipped --- >>
 2123200/2200005 96%
 2017-06-13T04:02:32.021+0000 I - [conn1] Index Build (background): 2148300/220
 2017-06-13T04:02:35.021+0000 I - [conn1] Index Build (background): 2172800/220
 2017-06-13T04:02:38.019+0000 I - [conn1] Index Build (background): 2195800/220
 2017-06-13T04:02:38.566+0000 I INDEX [conn1] build index done. scanned 2100006
 2017-06-13T04:02:38.572+0000 I COMMAND   [conn1] command mydb.$cmd appName: "Mon
*/
