// Add a node to an existing replica set. 

/*
Ensure that you have a single node replica set 
*/

// 1.  Assuming you have the node 
from the previous recipe already running, 
open a new Terminal and start a new replica set node:


mongod --dbpath G:/data/servers/server1/db --replSet MyReplicaSet --port 27018

2.  In another Terminal window, connect to the primary server using mongo shell (replace the IP with that of your server's):

mongo mongodb://192.168.200.200:27017


3.  Check the number of members in the replica set:

rs.status()['members']
 [
 {
 "_id" : 0,
 "name" : "vagrant-ubuntu-trusty-64:27017",
 "health" : 1,
 "state" : 1,
 "stateStr" : "PRIMARY",
 "uptime" : 36,
 "optime" : {
 "ts" : Timestamp(1503664489, 1),
 "t" : NumberLong(3)
 },
 "optimeDate" : ISODate("2017-08-25T12:34:49Z"),
 "infoMessage" : "could not find member to sync from",
 "electionTime" : Timestamp(1503664458, 1),
 "electionDate" : ISODate("2017-08-25T12:34:18Z"),
 "configVersion" : 1,
 "self" : true
 }
 ]


4.  Add the new node to the replica set:

rs.add('192.168.200.200:27018')


5.  Once again, check the members in the replica set:

{               "_id" : 0,
    "name" : "vagrant-ubuntu-trusty-64:27017",          
    "health" : 1,
    "state" : 1,
    "stateStr" : "PRIMARY",
    "uptime" : 71,
    "optime" : {
        "ts" : Timestamp(1503664527, 1), 
        "t" : NumberLong(3)
    },
    "optimeDate" : ISODate("2017-08-25T12:35:27Z"),
    "infoMessage" : "could not find member to sync from",
    "electionTime" : Timestamp(1503664458, 1),
    "electionDate" : ISODate("2017-08-25T12:34:18Z"),
     "configVersion" : 2,
    "self" : true
},
{
    "_id" : 1,
    "name" : "192.168.200.200:27018",
    "health" : 1,
    "state" : 0,
    "stateStr" : "STARTUP",
    "uptime" : 1,
    "optime" : {
        "ts" : Timestamp(0, 0),
        "t" : NumberLong(-1)
    },
    "optimeDurable" : {
        "ts" : Timestamp(0, 0),
        "t" : NumberLong(-1)
    },
    "optimeDate" : ISODate("1970-01-01T00:00:00Z"),
    "optimeDurableDate" : ISODate("1970-01-01T00:00:00Z"),
    "lastHeartbeat" : ISODate("2017-08- 5T12:35:27.327Z"),
    "lastHeartbeatRecv" : ISODate("2017-08-5T12:35:27.378Z"),
    "pingMs" : NumberLong(0),
    "configVersion" : -2
} 


How it works...


As mentioned earlier, this recipe assumes that you are already running the first (primary) node in your replica set, as show in the previous recipe. In step 1, we start another instance of mongod listening on a different port (27018). I just want to reiterate that as this is a test setup we will be running all instances of mongod on the same server, but in a production setup all replica set members should be running on separate servers.

In step 2, we look at the output of the rs.status() command, more importantly the members array. As of now, although we have started a new instance, the primary replica set node is not aware of its existence. Therefore, the list of members would only show one member. Let's fix this.

In step 3, we run rs.add('192.168.200.200:27018') in the mongo shell, which is connected to the primary node. The rs.add() method is a wrapper around the actual replSetReconfig command in that it adds a node to the members array and reconfigures the replica set. We will look into replica set reconfiguration in future recipes. Next, we look again at the output of the rs.status() command. If you inspect the members array, you will find our second member. If you have run the command soon after rs.add(...), you may be able to see the following:

"_id" : 1,
"name" : "192.168.200.200:27018", "health" : 1,
"state" : 0,
"stateStr" : "STARTUP",


The "state" : 0 string indicates that the member is parsing its configuration and starting up. If you run the rs.status() command again, this should change to "state" : 2, indicating that the node is a secondary node.

Keep an eye on the configVersion key of each member. Every change in the replica set's configuration increments the value of configVersion by one. This can be handy for a members's current configuration state.

To finish off this recipe, I would like you to start another instance of mongod on 
port 27019 and add it to the cluster.