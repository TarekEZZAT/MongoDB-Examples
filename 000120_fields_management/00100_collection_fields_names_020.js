

MongoDB is schema-less - you can add what ever fields you like to a record and it will save.

So how do you determine what fields have been used? The answer is a mapreduce function.

Suppose we have been using collection called things. Run this command in the MongoDB CLI - make sure you are connected to the correct database.

mr = db.runCommand({
  "mapreduce" : "things",
  "map" : function() {
    for (var key in this) { emit(key, null); }
  },
  "reduce" : function(key, stuff) { return null; },
  "out": "things" + "_keys"
})

when it has finished, run this,

db[mr.result].distinct("_id")

Your result will look like this,

[
  "_id",
  "firsttime",
  "firstvalue",
  "lasttime",
  "lastvalue",
  "sensor",
  "serial"
]

