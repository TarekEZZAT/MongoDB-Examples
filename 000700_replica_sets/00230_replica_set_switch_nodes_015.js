// Switching between primary and secondary nodes
// using priorities

We need a three node replica set, preferably without an arbiter. 
/*
we should have three mongod instances running on the same instance on three different ports, 27017, 27018, and 27019. 

We will call them node 1, node 2, and node 3 respectively. 

Here, we assume that node 1 is primary, 
whereas node 2 and node 3 are secondary. 
we will force node 1 to become secondary. 
Assuming that node 3 gets elected as primary, 
Then we will make node 1 primary again.
*/

// connect to node1 (primary)
  
cfg = rs.conf()
cfg.members[0].priority = 0.5
cfg.members[1].priority = 0.5
cfg.members[2].priority = 1
rs.reconfig(cfg)

// testing

rsData:PRIMARY> rs.status()
/*
2018-05-14T17:41:26.123+0200 I NETWORK  [thread1] Socket recv() Une connexion établie a été abandonnée par un logiciel de votre ordinateur hôte. 127.0.0.1:27017
2018-05-14T17:41:26.123+0200 I NETWORK  [thread1] SocketException: remote: (NONE):0 error: 9001 socket exception [RECV_ERROR] server [127.0.0.1:27017]
2018-05-14T17:41:26.125+0200 E QUERY    [thread1] Error: error doing query: failed: network error while attempting to run command 'replSetGetStatus' on host '127.0.0.1:27017'  :
DB.prototype.runCommand@src/mongo/shell/db.js:132:1
DB.prototype.adminCommand@src/mongo/shell/db.js:150:16
rs.status@src/mongo/shell/utils.js:1189:12
@(shell):1:1
2018-05-14T17:41:26.127+0200 I NETWORK  [thread1] trying reconnect to 127.0.0.1:27017 (127.0.0.1) failed
2018-05-14T17:41:26.172+0200 I NETWORK  [thread1] reconnect 127.0.0.1:27017 (127.0.0.1) ok
*/

// now node1 is secondary and node3 primary

rsData:SECONDARY> rs.status()
/*
{
        "set" : "rsData",
        "date" : ISODate("2018-05-14T15:41:50.166Z"),
        "myState" : 2,
        "term" : NumberLong(8),
        "syncingTo" : "localhost:27019",
        "heartbeatIntervalMillis" : NumberLong(2000),
        "optimes" : {
                "lastCommittedOpTime" : {
                        "ts" : Timestamp(1526312507, 1),
                        "t" : NumberLong(8)
                },
                "appliedOpTime" : {
                        "ts" : Timestamp(1526312507, 1),
                        "t" : NumberLong(8)
                },
                "durableOpTime" : {
                        "ts" : Timestamp(1526312507, 1),
                        "t" : NumberLong(8)
                }
        },
        "members" : [
                {
                        "_id" : 0,
                        "name" : "localhost:27017",
                        "health" : 1,
                        "state" : 2,
                        "stateStr" : "SECONDARY",
                        "uptime" : 11092,
                        "optime" : {
                                "ts" : Timestamp(1526312507, 1),
                                "t" : NumberLong(8)
                        },
                        "optimeDate" : ISODate("2018-05-14T15:41:47Z"),
                        "syncingTo" : "localhost:27019",
                        "configVersion" : 10,
                        "self" : true
                },
                {
                        "_id" : 1,
                        "name" : "localhost:27018",
                        "health" : 1,
                        "state" : 2,
                        "stateStr" : "SECONDARY",
                        "uptime" : 11045,
                        "optime" : {
                                "ts" : Timestamp(1526312507, 1),
                                "t" : NumberLong(8)
                        },
                        "optimeDurable" : {
                                "ts" : Timestamp(1526312507, 1),
                                "t" : NumberLong(8)
                        },
                        "optimeDate" : ISODate("2018-05-14T15:41:47Z"),
                        "optimeDurableDate" : ISODate("2018-05-14T15:41:47Z"),
                        "lastHeartbeat" : ISODate("2018-05-14T15:41:49.814Z"),
                        "lastHeartbeatRecv" : ISODate("2018-05-14T15:41:49.041Z"),
                        "pingMs" : NumberLong(0),
                        "syncingTo" : "localhost:27019",
                        "configVersion" : 10
                },
                {
                        "_id" : 2,
                        "name" : "localhost:27019",
                        "health" : 1,
                        "state" : 1,
                        "stateStr" : "PRIMARY",
                        "uptime" : 3088,
                        "optime" : {
                                "ts" : Timestamp(1526312507, 1),
                                "t" : NumberLong(8)
                        },
                        "optimeDurable" : {
                                "ts" : Timestamp(1526312507, 1),
                                "t" : NumberLong(8)
                        },
                        "optimeDate" : ISODate("2018-05-14T15:41:47Z"),
                        "optimeDurableDate" : ISODate("2018-05-14T15:41:47Z"),
                        "lastHeartbeat" : ISODate("2018-05-14T15:41:49.814Z"),
                        "lastHeartbeatRecv" : ISODate("2018-05-14T15:41:49.718Z"),
                        "pingMs" : NumberLong(0),
                        "electionTime" : Timestamp(1526312415, 1),
                        "electionDate" : ISODate("2018-05-14T15:40:15Z"),
                        "configVersion" : 10
                }
        ],
        "ok" : 1
}
*/


