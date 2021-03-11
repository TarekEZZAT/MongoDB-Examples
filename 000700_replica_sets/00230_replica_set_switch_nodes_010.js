// Switching between primary and secondary nodes


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
  


// 1.  Connect to the primary member (node 1) of the replica set:

mongo --port 27017

// remove the arbiter (port 27027)
rs.remove('localhost:27027')
// add node 3
rs.add('localhost:27019')

/* 2.  Force it to become secondary:

connect first to node 2 to freeze if for 300 sec as SECONDARY
*/
mongo --port 27018
freeze(300)
/*
reconnect to note 1 to force it to become secondary
*/

mongo --port 27017
rs.stepDown()


// 3.  Confirm the member is now secondary:

rs.isMaster()['ismaster']


4.  Log in to node 2, assuming it is secondary, and prevent it from getting elected:

mongo --port 27018 rs.freeze(120)
rs.freeze(120)


//5.  Log in to the newly elected primary node (node 3) of the replica set:

mongo mongodb://localhost:27019 rs.stepDown()


//6.  Force it to become secondary and prevent it from getting elected:

rs.freeze(120)


//7.  Check that the desired node (node 1) is now primary:

mongo mongodb://localhost:27017 
rs.isMaster()['ismaster'] 



