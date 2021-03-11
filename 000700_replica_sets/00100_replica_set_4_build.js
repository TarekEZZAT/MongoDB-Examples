
/*
Step 1: Create the necessary data directories for each member 
by issuing a command similar to the following:
*/

//mkdir -p /srv/mongodb/rs0-0 /srv/mongodb/rs0-1 /srv/mongodb/rs0-2

//This will create directories called “rs0-0”, “rs0-1”, and “rs0-2”, which will contain the instances’ database files.

/*Step 2:
Start your mongod instances in their own shell windows by issuing the following commands:

//First member:
mongod --dbpath G:/data/replicas/server1/db --replSet rsData --port 27017 --smallfiles and --oplogSize 128

//Second member:
mongod --dbpath G:/data/replicas/server2/db --replSet rsData --port 27018 --smallfiles and --oplogSize 128

//Third member:
mongod --dbpath G:/data/replicas/server3/db --replSet rsData --port 27019 --smallfiles and --oplogSize 128
*/


// The --smallfiles and --oplogSize settings reduce the disk space that each mongod instance uses. This is ideal for testing and development deployments as it prevents overloading your machine. 

/*
Step 3: Connect to one of your mongod instances through the mongo shell. 
You will need to indicate which instance by specifying its port number. 
*/

mongo --port 27017

/*
Step 4: In the mongo shell, use rs.initiate() to initiate the replica set.
*/
rs.initiate() 

/*
 You can create a replica set configuration object 
in the mongo shell environment
*/

load("E:/Training/MongoDB/SCRIPTS/000700_replica_sets/00100_replica_set_5_init.js")

rsconf = {
           _id: "rsData",
           members: [
                      {
                       _id: "rsData",
                       host: "localhost:27017"
                      }
                    ]
         }
/*

/*
If you do not use rsconf then while adding other members 
you might get following errors:
rs0:PRIMARY> rs.add("localhost:27018")
{
        "ok" : 0,
        "errmsg" : "Either all host names in a replica set configuration must be localhost references, or none must be; found 1 out of 2",
        "code" : 103
}
*/
To make sure all have localhost we will use configuration object:

rs0:PRIMARY> rsconf = {
...            _id: "rsData",
...            members: [
...                       {
...                        _id: 0,
...                        host: "localhost:27017"
...                       }
...                     ]
...          }
{
        "_id" : "rsData",
        "members" : [
                {
                        "_id" : 0,
                        "host" : "localhost:27017"
                }
        ]
}

replacing <hostname> with your system’s hostname, 
and then pass the rsconf file to rs.initiate() as follows:

rs0:PRIMARY> rs.initiate(rsconf)
{
        "info" : "try querying local.system.replset to see current configuration",
        "ok" : 0,
        "errmsg" : "already initialized",
        "code" : 23
}

This is because we have already given the rs.initiate() command. Now to make the server use the configuration object we need to use reconfig option as:

rs0:PRIMARY> rs.reconfig(rsconf)
{ "ok" : 1 }

//*** not important

 When we executee rs.reconfig() without any configuration object following messages showing conversion into Primary database will appear:
2016-06-19T16:31:31.121+0530 I REPL     [ReplicationExecutor] New replica set config in use: { _id: "rs0", version: 1, protocolVersion: 1, members: [ { _id: 0, host: "himanshu-PC:27017", arbiterOnly: false, buildIndexes: true, hidden: false, priority: 1.0, tags: {}, slaveDelay: 0, votes: 1 } ], settings: { chainingAllowed: true, heartbeatIntervalMillis: 2000, heartbeatTimeoutSecs: 10, electionTimeoutMillis: 10000, getLastErrorModes: {}, getLastErrorDefaults: { w: 1, wtimeout: 0 } } }
2016-06-19T16:31:31.121+0530 I REPL     [ReplicationExecutor] This node is himanshu-PC:27017 in the config
2016-06-19T16:31:31.123+0530 I REPL     [ReplicationExecutor] transition to STARTUP2
2016-06-19T16:31:31.126+0530 I REPL     [conn2] Starting replication applier threads
2016-06-19T16:31:31.131+0530 I COMMAND  [conn2] command local.oplog.rs command: replSetInitiate { replSetInitiate: undefined } keyUpdates:0 writeConflicts:0 numYields:0 reslen:129 locks:{ Global: { acquireCount: { r: 5, w: 3, W: 2 }, acquireWaitCount: { W: 1 }, timeAcquiringMicros: { W: 2679 } }, MMAPV1Journal: { acquireCount: { w: 4 } }, Database: { acquireCount: { w: 2, W: 1 } }, Metadata: { acquireCount: { w: 1, W: 3 } }, oplog: { acquireCount: { W: 2 } } } protocol:op_command 252ms
2016-06-19T16:31:31.142+0530 I REPL     [ReplicationExecutor] transition to RECOVERING
2016-06-19T16:31:31.162+0530 I REPL     [ReplicationExecutor] transition to SECONDARY
2016-06-19T16:31:31.163+0530 I REPL     [ReplicationExecutor] conducting a dry run election to see if we could be elected
2016-06-19T16:31:31.164+0530 I REPL     [ReplicationExecutor] dry election run succeeded, running for election
2016-06-19T16:31:31.169+0530 I REPL     [ReplicationExecutor] election succeeded, assuming primary role in term 1
2016-06-19T16:31:31.170+0530 I REPL     [ReplicationExecutor] transition to PRIMARY
2016-06-19T16:31:32.167+0530 I REPL     [rsSync] transition to primary complete; database writes are now permitted

After changing the configuration file using command rs.reconfig(rsconf), following messages will appear on Primary server instance:
2016-06-19T16:49:41.451+0530 I REPL     [conn3] replSetReconfig admin command received from client
2016-06-19T16:49:41.455+0530 I REPL     [conn3] replSetReconfig config object with 1 members parses ok
2016-06-19T16:49:41.490+0530 I REPL     [ReplicationExecutor] New replica set config in use: { _id: "rs0", version: 2, protocolVersion: 1, members: [ { _id: 0, host: "localhost:27017", arbiterOnly: false, buildIndexes: true, hidden: false, priority: 1.0, tags: {}, slaveDelay: 0, votes: 1 } ], settings: { chainingAllowed: true, heartbeatIntervalMillis: 2000, heartbeatTimeoutSecs: 10, electionTimeoutMillis: 10000, getLastErrorModes: {}, getLastErrorDefaults: { w: 1, wtimeout: 0 } } }
2016-06-19T16:49:41.491+0530 I REPL     [ReplicationExecutor] This node is localhost:27017 in the config


Before adding the secondary nodes, following messages will come in secondary instance:
2016-06-19T16:50:06.595+0530 W REPL     [rsSync] did not receive a valid config yet
*/

/*
Step 5:
In the mongo shell connected to the primary, add the second and third mongod instances to the replica set using the rs.add() method. Replace <hostname> with your system’s hostname in the following examples:
*/
 rs.add("localhost:27018")
 rs.add("localhost:27019")

rs.status()
/*
{
        "set" : "rsData",
        "date" : ISODate("2018-05-13T15:58:36.152Z"),
        "myState" : 1,
        "term" : NumberLong(1),
        "heartbeatIntervalMillis" : NumberLong(2000),
        "optimes" : {
                "lastCommittedOpTime" : {
                        "ts" : Timestamp(1526227107, 1),
                        "t" : NumberLong(1)
                },
                "appliedOpTime" : {
                        "ts" : Timestamp(1526227107, 1),
                        "t" : NumberLong(1)
                },
                "durableOpTime" : {
                        "ts" : Timestamp(1526227107, 1),
                        "t" : NumberLong(1)
                }
        },
        "members" : [
                {
                        "_id" : 0,
                        "name" : "localhost:27017",
                        "health" : 1,
                        "state" : 1,
                        "stateStr" : "PRIMARY",
                        "uptime" : 1615,
                        "optime" : {
                                "ts" : Timestamp(1526227107, 1),
                                "t" : NumberLong(1)
                        },
                        "optimeDate" : ISODate("2018-05-13T15:58:27Z"),
                        "electionTime" : Timestamp(1526225853, 1),
                        "electionDate" : ISODate("2018-05-13T15:37:33Z"),
                        "configVersion" : 4,
                        "self" : true
                },
                {
                        "_id" : 1,
                        "name" : "localhost:27018",
                        "health" : 1,
                        "state" : 2,
                        "stateStr" : "SECONDARY",
                        "uptime" : 28,
                        "optime" : {
                                "ts" : Timestamp(1526227107, 1),
                                "t" : NumberLong(1)
                        },
                        "optimeDurable" : {
                                "ts" : Timestamp(1526227107, 1),
                                "t" : NumberLong(1)
                        },
                        "optimeDate" : ISODate("2018-05-13T15:58:27Z"),
                        "optimeDurableDate" : ISODate("2018-05-13T15:58:27Z"),
                        "lastHeartbeat" : ISODate("2018-05-13T15:58:34.514Z"),
                        "lastHeartbeatRecv" : ISODate("2018-05-13T15:58:35.085Z"),
                        "pingMs" : NumberLong(0),
                        "syncingTo" : "localhost:27017",
                        "configVersion" : 4
                },
                {
                        "_id" : 2,
                        "name" : "localhost:27019",
                        "health" : 1,
                        "state" : 2,
                        "stateStr" : "SECONDARY",
                        "uptime" : 20,
                        "optime" : {
                                "ts" : Timestamp(1526227107, 1),
                                "t" : NumberLong(1)
                        },
                        "optimeDurable" : {
                                "ts" : Timestamp(1526227107, 1),
                                "t" : NumberLong(1)
                        },
                        "optimeDate" : ISODate("2018-05-13T15:58:27Z"),
                        "optimeDurableDate" : ISODate("2018-05-13T15:58:27Z"),
                        "lastHeartbeat" : ISODate("2018-05-13T15:58:35.686Z"),
                        "lastHeartbeatRecv" : ISODate("2018-05-13T15:58:34.476Z"),
                        "pingMs" : NumberLong(0),
                        "syncingTo" : "localhost:27017",
                        "configVersion" : 4
                }
        ],
        "ok" : 1
}
*/




