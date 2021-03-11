// Add an ARBITER instance

// 1.  Create directories for the arbiter process:

md G:/data/replicas/server4_arbiter/conf
md G:/data/replicas/server4_arbiter/db
md G:/data/replicas/server4_arbiter/logs

Arbiter configuration file
/*
00210_replica_set_2_arbiter_010.conf

systemLog:
  destination: file
  path: "G:/data/replicas/server4_arbiter/db/server4_arbiter.log"
  logAppend: true
storage:
  dbPath: "G:/data/replicas/server4_arbiter/db"
  engine: wiredTiger
  directoryPerDB: true
  journal:
      enabled: true
#security:
#  authorization: enabled
replication:
  oplogSizeMB: 128
  replSetName: rsData
#processManagement:
#   fork: true
net:
   bindIp: 127.0.0.1
   port: 27027

*/

// 2.  Start the arbiter process:

mongod --config 00210_replica_set_2_arbiter_010.conf


// 3.  Open a new Terminal window and connect to the primary node:

mongo --port 27017
rs.status()
/*
[
        {
                "_id" : 0,
                "name" : "localhost:27017",
                "health" : 1,
                "state" : 1,
                "stateStr" : "PRIMARY",
                "uptime" : 5905,
                "optime" : {
                        "ts" : Timestamp(1526307309, 1),
                        "t" : NumberLong(3)
                },
                "optimeDate" : ISODate("2018-05-14T14:15:09Z"),
                "electionTime" : Timestamp(1526301464, 1),
                "electionDate" : ISODate("2018-05-14T12:37:44Z"),
                "configVersion" : 6,
                "self" : true
        },
        {
                "_id" : 1,
                "name" : "localhost:27018",
                "health" : 1,
                "state" : 2,
                "stateStr" : "SECONDARY",
                "uptime" : 5858,
                "optime" : {
                        "ts" : Timestamp(1526307309, 1),
                        "t" : NumberLong(3)
                },
                "optimeDurable" : {
                        "ts" : Timestamp(1526307309, 1),
                        "t" : NumberLong(3)
                },
                "optimeDate" : ISODate("2018-05-14T14:15:09Z"),
                "optimeDurableDate" : ISODate("2018-05-14T14:15:09Z"),
                "lastHeartbeat" : ISODate("2018-05-14T14:15:21.736Z"),
                "lastHeartbeatRecv" : ISODate("2018-05-14T14:15:19.744Z"),
                "pingMs" : NumberLong(0),
                "configVersion" : 6
        }
]
*/


// 4.  Add the arbiter:

rs.addArb('localhost:27027')
/*
to remove the arbiter
rs.remove('localhost:27027)
*/

// 5.  Check the members of the replica set:

rs.status()['members'] 

/*

[
        {
                "_id" : 0,
                "name" : "localhost:27017",
                "health" : 1,
                "state" : 1,
                "stateStr" : "PRIMARY",
                "uptime" : 6749,
                "optime" : {
                        "ts" : Timestamp(1526308164, 1),
                        "t" : NumberLong(3)
                },
                "optimeDate" : ISODate("2018-05-14T14:29:24Z"),
                "electionTime" : Timestamp(1526301464, 1),
                "electionDate" : ISODate("2018-05-14T12:37:44Z"),
                "configVersion" : 7,
                "self" : true
        },
        {
                "_id" : 1,
                "name" : "localhost:27018",
                "health" : 1,
                "state" : 2,
                "stateStr" : "SECONDARY",
                "uptime" : 6702,
                "optime" : {
                        "ts" : Timestamp(1526308164, 1),
                        "t" : NumberLong(3)
                },
                "optimeDurable" : {
                        "ts" : Timestamp(1526308164, 1),
                        "t" : NumberLong(3)
                },
                "optimeDate" : ISODate("2018-05-14T14:29:24Z"),
                "optimeDurableDate" : ISODate("2018-05-14T14:29:24Z"),
                "lastHeartbeat" : ISODate("2018-05-14T14:29:25.443Z"),
                "lastHeartbeatRecv" : ISODate("2018-05-14T14:29:27.429Z"),
                "pingMs" : NumberLong(0),
                "syncingTo" : "localhost:27017",
                "configVersion" : 7
        },
        {
                "_id" : 2,
                "name" : "localhost:27027",
                "health" : 1,
                "state" : 7,
                "stateStr" : "ARBITER",
                "uptime" : 53,
                "lastHeartbeat" : ISODate("2018-05-14T14:29:26.488Z"),
                "lastHeartbeatRecv" : ISODate("2018-05-14T14:29:25.598Z"),
                "pingMs" : NumberLong(0),
                "configVersion" : 7
        }
]
rsData:PRIMARY>
*/
/*
If you look at the state and stateStr keys, you will see that this member is set state to 7, which confirms it is an arbiter. 
*/