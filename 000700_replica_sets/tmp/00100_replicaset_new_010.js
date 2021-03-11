// Replica sets

/*
items
Initializing a new replica set 
Adding a node to the replica set 
Removing a node from the replica set 
Working with an arbiter
Switching between primary and secondary nodes
Changing replica set configuration
Changing priority to replica set nodes 
*/

/* A replica set is essentially a group of MongoDB servers 
that form a quorum and replicate data across all nodes. 
*/

/*
The primary node accepts all writes to the database, 
and each write operation is replicated to the secondary nodes 
through replication of operation logs, which are also known as oplogs.
*/
 

/*
A node is determined as primary by way of an election between the nodes
in the replica set. 
Any node within the cluster can become a primary node at any point. 
It is important to have an odd number of nodes in the replica set 
to ensure that the election process does not result in a tie. 
If you choose to have an even number of nodes in the replica set, 
MongoDB provides a non-resource intensive arbiter server 
that can perform heartbeats and take part in the election process.
*/

/*
Set up the first node of a three node replica set on a single server.
In a production setup, this should be on three physically separate servers. 
*/

// Linux
mkdir -p /data/server{1,2,3}/{conf,logs,db}

// Windows

md g:\data\servers\server1\conf
md g:\data\servers\server1\logs
md g:\data\servers\server1\db

md g:\data\servers\server2\conf
md g:\data\servers\server2\logs
md g:\data\servers\server2\db

md g:\data\servers\server3\conf
md g:\data\servers\server3\logs
md g:\data\servers\server3\db
/*
This should create three parent directories: /data/server1,
/data/server2, and /data/server3, each containing subdirectories named conf, logs, and db. We will be using this directory format throughout the chapter. 
*/

How to do it...


// 1.  Start the first node in the replica set:

mongod --dbpath G:/data/servers/server1/db --replSet MyReplicaSet


/* 2.  Open a new Terminal window, 
connect to the replica set node using the MongoDB shell, 
and check the replica set's status:
*/

rs.status()
/*
{
  "info" : "run  rs.initiate(...) if not yet done  for the set",
  "ok"   : 0,
  "errmsg" : "no   replset config has been received",
  "code"  : 94,
  "codeName" : "NotYetInitialized"
}
*/

// 3.  Initialize the replica set:

rs.initiate()
/*
{
   "info2" : "no   configuration specified. Using a  default configuration for the set
   "me" : "vagrant-ubuntu-trusty-64:27017",
   "ok"   : 1
}
*/

4.  Check the replica set's status again:

rs.status()
/*
{
 "set" : "MyReplicaSet",
 "date" : ISODate("2017-08-20T05:28:26.827Z"),
 "myState" : 1,
 "term" : NumberLong(1),
 "heartbeatIntervalMillis" : NumberLong(2000),
 "optimes" : {
 "lastCommittedOpTime" : {
 "ts" : Timestamp(1503206903, 1),
 "t" : NumberLong(1)
 },
 "appliedOpTime" : {
 "ts" : Timestamp(1503206903, 1),
 "t" : NumberLong(1)
 },
 "durableOpTime" : {
 "ts" : Timestamp(1503206903, 1),
 "t" : NumberLong(1)
 }
 },
 "members" : [
 { 
 "_id" : 0,
 "name" : "vagrant-ubuntu-trusty-64:27017",
 "health" : 1,
 "state" : 1,
 "stateStr" : "PRIMARY",
 "uptime" : 35,
 "optime" : {
 "ts" : Timestamp(1503206903, 1),
 "t" : NumberLong(1)
 },
 "optimeDate" : ISODate("2017-08-20T05:28:23Z"),
 "infoMessage" : "could not find member to sync from",
 "electionTime" : Timestamp(1503206902, 2),
 "electionDate" : ISODate("2017-08-20T05:28:22Z"),
 "configVersion" : 1,
 "self" : true
 }
 ],
 "ok"   : 1
 }
*/

// 5.  Switch back to the mongod Terminal window and inspect the server logs:

2017-08-20T05:28:16.928+0000 I NETWORK [thread1] connection accepted from 192.1
 2017-08-20T05:28:16.929+0000 I NETWORK [conn1] received client metadata from 1
 2017-08-20T05:28:22.625+0000 I COMMAND   [conn1] initiate : no   configuration spe
 2017-08-20T05:28:22.625+0000 I COMMAND [conn1] created this configuration for 
 2017-08-20T05:28:22.625+0000 I REPL [conn1] replSetInitiate admin command rece
 2017-08-20T05:28:22.625+0000 I REPL [conn1] replSetInitiate config object with
 2017-08-20T05:28:22.625+0000 I REPL [conn1] ******
 2017-08-20T05:28:22.625+0000 I REPL [conn1] creating replication oplog of size
 2017-08-20T05:28:22.628+0000 I STORAGE [conn1] Starting WiredTigerRecordStoreT
 2017-08-20T05:28:22.628+0000 I STORAGE [conn1] The size storer reports that th
 2017-08-20T05:28:22.628+0000 I STORAGE [conn1] Scanning the oplog to determine
 2017-08-20T05:28:22.634+0000 I REPL [conn1] ******
 2017-08-20T05:28:22.646+0000 I INDEX [conn1] build index on: admin.system.vers
 2017-08-20T05:28:22.646+0000 I INDEX [conn1] building index using bulk method;
 2017-08-20T05:28:22.646+0000 I INDEX [conn1] build index done. scanned 0  total
 2017-08-20T05:28:22.646+0000 I COMMAND   [conn1] setting featureCompatibilityVer
 2017-08-20T05:28:22.647+0000 I REPL [conn1] New replica set config in use: { _
 2017-08-20T05:28:22.647+0000 I REPL [conn1] This node  is vagrant-ubuntu-trusty
 2017-08-20T05:28:22.647+0000 I REPL [conn1] transition to STARTUP2
 2017-08-20T05:28:22.647+0000 I REPL [conn1] Starting replication storage threa
 2017-08-20T05:28:22.647+0000 I REPL [conn1] Starting replication fetcher threa
 2017-08-20T05:28:22.647+0000 I REPL [conn1] Starting replication applier threa
 2017-08-20T05:28:22.647+0000 I REPL [conn1] Starting replication reporter thre
 2017-08-20T05:28:22.647+0000 I REPL [rsSync] transition to RECOVERING
 2017-08-20T05:28:22.648+0000 I REPL [rsSync] transition to SECONDARY
 2017-08-20T05:28:22.648+0000 I REPL [rsSync] conducting a dry run election to 
 2017-08-20T05:28:22.648+0000 I REPL [ReplicationExecutor] dry  election run  suc
 2017-08-20T05:28:22.654+0000 I REPL [ReplicationExecutor] election succeeded, 
 2017-08-20T05:28:22.654+0000 I REPL [ReplicationExecutor] transition to PRIMAR
 2017-08-20T05:28:22.654+0000 I REPL [ReplicationExecutor] Entering primary cat
 2017-08-20T05:28:22.654+0000 I REPL [ReplicationExecutor] Exited primary catch
 2017-08-20T05:28:23.649+0000 I REPL [rsSync] transition to primary complete; d 



/*
In step 1, we begin by starting the mongod process with the two parameters.
 First, we provide the database path with --dbpath, 
 which is quite standard with all mongod processes. 
 Next, we provide the --replSet parameter with the value MyReplicaSet. 
 This parameter starts the mongod process with the explicit instruction
 that it will be running a replica set node 
 and the unique name for this replica set is ReplicaSet. 
 MongoDB uses naming constructs to identify a replica set cluster. 
 This can be changed in the future 
 but would require you to shut down all the nodes within the cluster.

In step 2, we open a different Terminal window 
and start the mongo shell that is connected to our aforementioned node.
 We check the replica set's status by running the rs.status() command. 
 If you ever happen to work with replica sets, 
 rs.status() will become the most frequent command you will use
 for eons to come. 
 I would also like to point out that all major replica set operations
 are available in the rs.<command> format. 
 To view your options, type rs. (with the trailing dot) 
 and press the Tab key twice.

OK, coming back to the output of rs.status(), 
we can see that MongoDB is indicating that our replica set has not been initialized. We do so by running the rs.initiate() command in step 3. At this point, if you keep pressing the Enter key (without any parameters), you can see your mongo shell show the transition of starting the node as a SECONDARY and then PRIMARY:

rs.initiate()
{
 "info2" : "no   configuration specified. Using a  default configuration for the set",
 "me" : "vagrant-ubuntu-trusty-64:27017",
 "ok"   : 1
 }
 MyReplicaSet:SECONDARY>
 MyReplicaSet:PRIMARY>
 MyReplicaSet:PRIMARY>


From now on, every time you connect to this node, 
you will see the replica set name followed by the node's status. 
Next, we run the rs.status() command again 
and this time get the detailed status of the replica set's configuration. 
Let's go through some of the key values of the output: 
set: This indicates the name of the replica set.
myState: This indicates the status of the current node in the replica set. 
The most common states you will encounter are as follows:



State	State		Decription
0 		STARTUP 	The node is parsing configuration and is starting up
1		PRIMARY		The node is the primary member of the cluster
2		SECONDARY	The node is a secondary member of the cluster
3		RECOVERING	The node is completing either rollback or resync after starting up
7		ARBITER		The node is an arbiter, it does not store any data
8 		DOWN		The node is marked as DOWN usually when it is unreachable
10 		REMOVED		The node has been removed from the replica set configuration

There are more MongoDB replica set states; they can be found at ht
tps://docs.mongodb.com/manual/reference/replica-states/.



heartbeatIntervalMillis: 
This indicates the frequency of health checks between nodes in milliseconds.
members: An array containing a list of members currently in the replica set. Each member entry is accompanied by details about the member, such as its 
name, state, up time, and an information message showing its current state. 
We will be looking at them more closely in future recipes in this chapter. 
For now, I just want you to get acquainted with this format.

Once we execute the rs.initiate() command, 
MongoDB attempts to figure out any configuration parameters 
associated with this replica set 
(in the form of a config file or mongod command-line flags) 
and initialized the replica set. In our case, 
we only mentioned the name of the replica set 
MyReplicaSet as a mongod parameter.

In step 5, by looking at the mongod process logs, 
we can observe the various stages the application goes through, 
while trying to bring up a node in a replica set. 
The information is pretty verbose, so I will not go into detail. 
