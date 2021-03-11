// Remove a node from the replica set

use northwind

/* 1.  Open the mongo shell and log in to one of the nodes. 
Run rs.status() to find the primary node:
*/
rs.status()['members'] // find primary node
/*

[
        {
                "_id" : 0,
                "name" : "localhost:27017",
                "health" : 1,
                "state" : 1,
                "stateStr" : "PRIMARY",
                "uptime" : 3718,
                "optime" : {
                        "ts" : Timestamp(1526305129, 1),
                        "t" : NumberLong(3)
                },
                "optimeDate" : ISODate("2018-05-14T13:38:49Z"),
                "electionTime" : Timestamp(1526301464, 1),
                "electionDate" : ISODate("2018-05-14T12:37:44Z"),
                "configVersion" : 3,
                "self" : true
        },
        {
                "_id" : 1,
                "name" : "localhost:27018",
                "health" : 1,
                "state" : 2,
                "stateStr" : "SECONDARY",
                "uptime" : 3671,
                "optime" : {
                        "ts" : Timestamp(1526305129, 1),
                        "t" : NumberLong(3)
                },
                "optimeDurable" : {
                        "ts" : Timestamp(1526305129, 1),
                        "t" : NumberLong(3)
                },
                "optimeDate" : ISODate("2018-05-14T13:38:49Z"),
                "optimeDurableDate" : ISODate("2018-05-14T13:38:49Z"),
                "lastHeartbeat" : ISODate("2018-05-14T13:38:55.550Z"),
                "lastHeartbeatRecv" : ISODate("2018-05-14T13:38:55.550Z"),
                "pingMs" : NumberLong(0),
                "syncingTo" : "localhost:27017",
                "configVersion" : 3
        },
        {
                "_id" : 2,
                "name" : "localhost:27019",
                "health" : 1,
                "state" : 2,
                "stateStr" : "SECONDARY",
                "uptime" : 3640,
                "optime" : {
                        "ts" : Timestamp(1526305129, 1),
                        "t" : NumberLong(3)
                },
                "optimeDurable" : {
                        "ts" : Timestamp(1526305129, 1),
                        "t" : NumberLong(3)
                },
                "optimeDate" : ISODate("2018-05-14T13:38:49Z"),
                "optimeDurableDate" : ISODate("2018-05-14T13:38:49Z"),
                "lastHeartbeat" : ISODate("2018-05-14T13:38:55.550Z"),
                "lastHeartbeatRecv" : ISODate("2018-05-14T13:38:55.971Z"),
                "pingMs" : NumberLong(0),
                "syncingTo" : "localhost:27018",
                "configVersion" : 3
        }
]

*/

// 2.  Run rs.remove() to remove the last node in the replica set:

rs.remove('localhost:27019')


// 3.  Check the status of the replica set:

rs.status()['members'] 

[
        {
                "_id" : 0,
                "name" : "localhost:27017",
                "health" : 1,
                "state" : 1,
                "stateStr" : "PRIMARY",
                "uptime" : 3813,
                "optime" : {
                        "ts" : Timestamp(1526305226, 1),
                        "t" : NumberLong(3)
                },
                "optimeDate" : ISODate("2018-05-14T13:40:26Z"),
                "electionTime" : Timestamp(1526301464, 1),
                "electionDate" : ISODate("2018-05-14T12:37:44Z"),
                "configVersion" : 4,
                "self" : true
        },
        {
                "_id" : 1,
                "name" : "localhost:27018",
                "health" : 1,
                "state" : 2,
                "stateStr" : "SECONDARY",
                "uptime" : 3766,
                "optime" : {
                        "ts" : Timestamp(1526305226, 1),
                        "t" : NumberLong(3)
                },
                "optimeDurable" : {
                        "ts" : Timestamp(1526305226, 1),
                        "t" : NumberLong(3)
                },
                "optimeDate" : ISODate("2018-05-14T13:40:26Z"),
                "optimeDurableDate" : ISODate("2018-05-14T13:40:26Z"),
                "lastHeartbeat" : ISODate("2018-05-14T13:40:30.185Z"),
                "lastHeartbeatRecv" : ISODate("2018-05-14T13:40:26.405Z"),
                "pingMs" : NumberLong(0),
                "configVersion" : 4
        }
]

/*
4.  Connect to the third replica set node, (removed), 
in a new terminal, and check rs.status()
*/
mongo --port 27019
rs.status()
/*
{
{
        "state" : 10,
        "stateStr" : "REMOVED",
        "uptime" : 3926,
        "optime" : {
                "ts" : Timestamp(1526305226, 1),
                "t" : NumberLong(3)
        },
        "optimeDate" : ISODate("2018-05-14T13:40:26Z"),
        "ok" : 0,
        "errmsg" : "Our replica set config is invalid or we are not a member of it",
        "code" : 93,
        "codeName" : "InvalidReplicaSetConfig"
}
 MyReplicaSet:OTHER> 
*/

/*
You cannot remove a primary node from the replica set. You need to force it into becoming secondary and then remove it. 

Switching between primary and secondary nodes is discussed later
*/

/*
In step 4, we connect to the mongo shell of the node that we just removed. As soon as you log in, you can observe that the console prompt shows OTHER instead of PRIMARY or SECONDARY. Also, the rs.status() command's output confirms that the node is in state 10 (REMOVED), indicating that this node is no longer in the replica set cluster. 
*/

/*
Go through the mongod logs of this node and observe the sequence of events that occur when we run rs.remove(): 

... Cannot find self in new replica set configuration; I must be removed; etc. 
2017-08-26T04:40:51.339+0000  I REPL [ReplicationExecutor] This node is
not a member of the config
2017-08-26T04:40:51.339+0000  I REPL [ReplicationExecutor] transition to
REMOVED
*/

/*
rs.remove('localhost:27019') on the primary node generates a new configuration

This configuration is sent to all new or existing nodes of the replica set and the relevant changes are implemented. 

In the log output shown previously, you can see that the replica set node got the new configuration and figured out that it had been removed from the replica set cluster. 

It then reconfigured itself and transitioned to the REMOVED state. 
*/

/*
ARBITER
In MongoDB, nodes within replica sets perform elections to select a primary node. To ensure there is always a majority in the number of nodes, you can add an arbiter to the replica set. An ARBITER is a mongod instance that does not store data but is only involved in voting during an election process. This can prove very useful, especially during network partitions that result in conflicting votes.
*/