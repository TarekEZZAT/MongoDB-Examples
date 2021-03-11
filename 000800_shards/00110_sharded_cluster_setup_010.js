//Setting up and configuring a sharded cluster

/*
How to set up a sharded cluster in MongoDB. 
The cluster includes 
config servers, 
shards, 
mongos servers. 

all relevant binaries run from a single virtual machine;
however, in production, they should be located on separate nodes. 

Next, enable sharding on a database, 
followed by sharding an actual collection. 
When sharded cluster is ready, 
Import data to the cluster
Execute queries 
See the data partitioned across the shards.
*/
  
/*
Create the following directories for the config server as well as the shards:

mkdir -p /data/{cfgserverA,shard1,shard2,shard3}/data 

windows

md G:\data\shards\shard1\data
md G:\data\shards\shard2\data
md G:\data\shards\shard3\data
md G:\data\shards\cfgserverA\data

use

G:/data/shards/shard1/data
G:/data/shards/shard2/data
G:/data/shards/shard3/data
G:/data/shards/cfgserverA/data
*/


//1.  Start the config server:

//configuration server configuration file
//E:\Training\MongoDB\SCRIPTS\000800_shards\00200_sharded_cluster_start_1_config_server.conf
/*
systemLog:
  destination: file
  path: "G:/data/shards/cfgserverA/logs/cfgserverA.log"
  logAppend: true
storage:
  dbPath: "G:/data/shards/cfgserverA/data"
  engine: wiredTiger
  directoryPerDB: true
  journal:
      enabled: true
#security:
#  authorization: enabled
#####  NO REPLICATION FOR THE CONFIGURATION SERVER
#replication:
#  oplogSizeMB: 128
#  replSetName: rsConfSvr
#processManagement:
#   fork: true
net:
   bindIp: 127.0.0.1
   port: 27019
*/
//mongod --configsvr --config E:\Training\MongoDB\SCRIPTS\000800_shards\00200_sharded_cluster_start_1_config_server.conf

//mongod --configsvr --dbpath G:/data/shards/cfgserverA/data --port 27019 --replSet rsConfigSvr


mongod --configsvr --dbpath G:/data/shards/cfgserverA/data --port 27019 --replSet rsConfigSvr --logpath "G:/data/shards/cfgserverA/logs/cfgserverA.log" --logappend --directoryperdb




//or

//mongod --configsvr --dbpath /data/cfgserverA/data --port 27019

// prompt is configsvr>



//2.  Initialize the config server replica set:

mongo localhost:27019 
rs.initiate()
/*
{
        "info2" : "no configuration specified. Using a default configuration for the set",
        "me" : "HORUS:27019",
        "ok" : 0,
        "errmsg" : "No host described in new configuration 1 for replica set rsConfSvr maps to this node",
        "code" : 93,
        "codeName" : "InvalidReplicaSetConfig"
}
*/

rs.status()['configsvr']
/*
true
*/

3.  Start three shard servers:

Shard servers confiduration files

/*
systemLog:
  destination: file
  path: "G:/data/shards/shard1/logs/shard1.log"
  logAppend: true
storage:
  dbPath: "G:/data/shards/shard1/data"
  engine: wiredTiger
  directoryPerDB: true
  journal:
      enabled: true
#security:
#  authorization: enabled
replication:
  oplogSizeMB: 128
  replSetName: rsConfSvr
#processManagement:
#   fork: true
net:
   bindIp: 127.0.0.1
   port: 27027
****************************

E:\Training\MongoDB\SCRIPTS\000800_shards\00200_sharded_cluster_start_2_shard_server1.conf

systemLog:
  destination: file
  path: "G:/data/shards/shard2/logs/shard2.log"
  logAppend: true
storage:
  dbPath: "G:/data/shards/shard2/data"
  engine: wiredTiger
  directoryPerDB: true
  journal:
      enabled: true
#security:
#  authorization: enabled
replication:
  oplogSizeMB: 128
  replSetName: rsConfSvr
#processManagement:
#   fork: true
net:
   bindIp: 127.0.0.1
   port: 27028
****************************
systemLog:
  destination: file
  path: "G:/data/shards/shard3/logs/shard3.log"
  logAppend: true
storage:
  dbPath: "G:/data/shards/shard3/data"
  engine: wiredTiger
  directoryPerDB: true
  journal:
      enabled: true
#security:
#  authorization: enabled
replication:
  oplogSizeMB: 128
  replSetName: rsConfSvr
#processManagement:
#   fork: true
net:
   bindIp: 127.0.0.1
   port: 27029  
*/

/*
mongod --shardsvr --config E:/Training/MongoDB/SCRIPTS/000800_shards/00200_sharded_cluster_start_2_shard_server1.conf

mongod --shardsvr --config E:/Training/MongoDB/SCRIPTS/000800_shards/00200_sharded_cluster_start_2_shard_server1.conf

mongod --shardsvr --config E:/Training/MongoDB/SCRIPTS/000800_shards/00200_sharded_cluster_start_2_shard_server1.conf
*/

mongod --configsvr --dbpath G:/data/shards/cfgserverA/data --port 27019 --replSet rsConfigSvr --logpath "G:/data/shards/cfgserverA/logs/cfgserverA.log" --logappend true --directoryperdb true
mongod --configsvr --dbpath G:/data/shards/cfgserverA/data --port 27019 --replSet rsConfigSvr --logpath "G:/data/shards/cfgserverA/logs/cfgserverA.log" --logappend --directoryperdb
/*

or 
mongod --shardsvr --dbpath G:/data/shards/shard1/data --port 27027 
mongod --shardsvr --dbpath G:/data/shards/shard2/data --port 27027 
mongod --shardsvr --dbpath G:/data/shards/shard3/data --port 27027 
*/



//4.  Start the mongos query router:

//mongos --configdb MyConfigRepl/localhost:27019
mongos --configdb rsConfigSvr/localhost:27019


5.  Connect to the mongos server and add the shard mongo
mongodb://127.0.0.1:27017. Then add the shards to the cluster:

sh.addShard('localhost:27027')

{ "shardAdded" : "shard0000", "ok"   : 1  }

sh.addShard('localhost:27028')

{ "shardAdded" : "shard0001", "ok"   : 1  }

sh.addShard('localhost:27029')

{ "shardAdded" : "shard0002", "ok"   : 1  }

sh.status()

--- Sharding Status ---
 sharding version: { 
 "_id" : 1,
 "minCompatibleVersion" : 5,
 "currentVersion" : 6,
 "clusterId" : ObjectId("59c7950c9be3cff24816915a")
 }
 shards:
 { "_id" : "shard0000", "host" : "localhost:27027", "state" : 1  }
 { "_id" : "shard0001", "host" : "localhost:27028", "state" : 1  }
 { "_id" : "shard0002", "host" : "localhost:27029", "state" : 1  }
 <-- output truncated -->


6.  Enable sharding for a database:

sh.enableSharding('myShardedDB')
{ "ok"   : 1  }
sh.status()

--- Sharding Status ---
 <--output truncated-->
 databases:
 { "_id" : "myShardedDB", "primary" : "shard0001", "partitioned" : true }


7.  Shard a collection:

sh.shardCollection('myShardedDB.people', {language: 1})
{ "collectionsharded" : "myShardedDB.people", "ok"   : 1  }

sh.status()

--- Sharding Status ---
 sharding version: {
 "_id" : 1,
 "minCompatibleVersion" : 5,
 "currentVersion" : 6,
 "clusterId" : ObjectId("59c7950c9be3cff24816915a")
 }
 shards:
 { "_id" : "shard0000", "host" : "localhost:27027", "state" : 1  }
 { "_id" : "shard0001", "host" : "localhost:27028", "state" : 1  }
 { "_id" : "shard0002", "host" : "localhost:27029", "state" : 1  }
 <-- output truncated -->
 databases:
 { "_id" : "myShardedDB", "primary" : "shard0001", "partitioned" : true }
 myShardedDB.people
 shard key: { "language" : 1  }
 unique: false
 balancing: true
 chunks:
 shard0001 1
 { "language" : { "$minKey" : 1 } } -->> { "language" : { "$maxKey" : 1 } } on 


8.  Add some data to our database:

mongoimport -h localhost --type csv --headerline -d myShardedDB -c people


9.  Inspect the data distribution:

sh.status() 

--- Sharding Status ---
--- <output truncated> ---
 { "_id" : "myShardedDB", "primary" : "shard0001", "partitioned" : true }
 myShardedDB.people
 shard key: { "language" : 1  }
 unique: false
 balancing: true
 chunks:
 shard0000 1
 shard0001 2
 shard0002 1
 { "language" : { "$minKey" : 1  } } -->> { "language" : ""  } on   : shard0000 Tim
 { "language" : ""  } -->> { "language" : "Irish Gaelic" } on   : shard0002 Timest
 { "language" : "Irish Gaelic" } -->> { "language" : "Norwegian" } on   : shard00
 { "language" : "Norwegian" } -->> { "language" : { "$maxKey" : 1  } } on   : shar


10.  Fetch some records from a single shard:

db.people.find({ "language" : "Norwegian" }).explain()

{
 "queryPlanner" : {
 "mongosPlannerVersion" : 1,
 "winningPlan" : {
 "stage" : "SINGLE_SHARD",
 "shards" : [
 {
 "shardName" : "shard0001",
 "connectionString" : "localhost:27028",
 <--output truncated -->


11.  Fetch records from multiple shards:

db.people.find({ "language": {"$in": ["Norwegian", "Arabic"]} }).explain()

{
 "queryPlanner" : {
 "mongosPlannerVersion" : 1,
 "winningPlan" : {
 "stage" : "SHARD_MERGE",
 "shards" : [
 {
 "shardName" : "shard0001",
 <-- output truncated -->
 "shardName" : "shard0002",
 <-- output truncated --> 


How it works...


We begin setting up the sharded cluster by starting a single instance of the config server in step 1. As of MongoDB 3.4, it is required that the config server is set
up as a replica set. However, for demonstration purposes, we are only going to run one config server in this replica set. The service runs through the mongod binary with the --configsvr parameter and takes in --dbpath as well as --port. As the config server contains metadata, including authorization details, it does make sense to run it as a replica set while ensuring we maintain optimal backups and monitoring. We will cover more on the latter in future chapters.

In step 2, we connect to the config server using mongo shell and initiate the replica set. This is a pretty straightforward operation, as we have seen previously in Chapter 2, Understanding and Managing Indexes. The only point I've
highlighted here is that if you run rs.status() on a config server, you should see a key which says 'configsvr'  : true. This key should be verified to confirm that the replica set is indeed for your config server.

In step 3, we start three instances of mongod shards, each pointing to a separate -
-dbpath and --port. Up until this point, the shards are not configured, and hence, they are simply waiting for information from the config server.

In step 4, we start the mongos service and explicitly point it to the config server replica set using the --configdb switch. You will note that the connection string takes the name of the config server replica set as its prefix and is followed by the IP/hostname of the config server; for example,

ReplicaSetName/host1:port1,host2:port2,...hostN:portN


At this point, our sharded cluster not contains a config server and a query router (mongos). We now need to add the shard servers to the cluster. To begin, we connect to the mongos service (in step 5) and use the sh.addShard() function to add each shard:

sh.addShard('localhost:27027')
{ "shardAdded" : "shard0000", "ok"   : 1  }

All shard management commands have helper functions within the 

    sh.<function-name> namespace. For example, sh.status(), sh.addShard(), and so on.


The string shard0000 is a unique ID of this shard. By running sh.status(), we can confirm that all three shards have been added, each with a unique ID. Additionally, you can also observe that at this point the databases section, in the sh.status() output, is empty (this is expected).

In step 6, we enable sharding for the database myShardedDB by using the command sh.enableSharding('myShardedDB'). If you run the sh.status() command, you will observe that the databases section now shows the following:

{   "_id" : "myShardedDB",  "primary" : "shard0001",  "partitioned" : true }


Here, MongoDB has assigned shard with ID shard001 as the primary shard for the database (chances are that your setup may have chosen a different ID, and that's okay). There is a good chance that you would have more than one collection in your database. Hence, MongoDB selects a primary shard to store data of non- sharded collections.

Now comes the most important part of this whole exercise—selecting the shard key. As shards store data in chunks, distribution of chunks is determined by the type of sharding key used. As discussed in the previous section of this chapter, by default, MongoDB uses ranged keys. We will use this key type in our example setup as well.

In step 7, we shard the collection named people on the field language. This creates a ranged sharding key on the language field in ascending order. Run sh.status() and view the databases section in the command output.

As we have no data in the collection, you should see there is exactly one chunk, on shard0001, and it covers the entire range of the field, that is, from $minKey to
$maxKey.


In step 8, we import some sample data in our newly sharded collection. The data imported is available in the file chapter_2_mock_data.csv, which can be downloaded from the Packt website.

Now that we have the data imported, let's have a look at the status of the shard. 
In step 9, we run sh.status() and inspect the databases section of the output. You can see that, based on the index created in the field language, MongoDB has partitioned the data in four chunks across all three shards. As we have used a ranged shard key, the partitions are performed on string values of the language key. For example, shard0001 has two chunks: one contains all the documents of the language field, ranging from Irish Gaelic to Norwegian, and the other chunk contains all values from Norwegian to $maxKey (end of index).

With this information in mind, we now know that all records for {language: "Norwegian"} would reside on one shard, that is shard0001. This can be confirmed by running a find() operation, as seen in step 10. The winning plan indicates that the result was obtained from a single shard.

In step 11, we run a similar query, but this time the range spreads across multiple shards. In that, mongos would make a query to two shards (shard0001 and shard0002), and await their response. Then, mongos would merge the results and present it to the application (in our case, mongo shell).

As an exercise, I would suggest you re-create the cluster, but with hashed key type, and observe how the chunks are created. 
