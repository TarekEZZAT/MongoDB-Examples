// Fetch and change the replica set configuration



//1.  Connect to the primary member of the replica set using the mongo shell:

mongo mongodb://localhost:27017


//2.  Fetch the configuration:

 conf =  rs.conf()


//3.  Remove the third member of the replica set:

 conf['members'].pop(2)


//4.  Reconfigure the replica set:

 rs.reconfig(conf)


//5.  Confirm that the third node was removed 

 rs.status()['members']


// 6.  Add the third node back to the replica set:

 member =  {"_id": 2, "host": "localhost:27019"}
 conf['members'].push(member)


//7.  Reconfigure the replica set:

 rs.reconfig(conf)


//8.  Confirm that the addition was successful:

 rs.status()['members'] 

/*
Replica set configuration operations can only be performed on the primary node.

The configuration contains an array of members. 
So, in order to remove a member, we simply have to remove its entry from the array and reload the configuration with the new values. 

we use the JavaScript native pop() method to remove an entry from the members array. 
By running conf['members'].pop(2) we are removing the third entry from the array (note that array indexes start from zero). 
rs.reconfig() function reloads the configuration


Create an object that contains the _id and host entry for the node that we wish to add.

We append the configuration's members array and add this entry to it. 

Reload the configuration again and confirm that the node was added back to the replica set. 
*/