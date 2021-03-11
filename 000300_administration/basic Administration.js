/* DATA

{"date": "10/31/2014", "speaker": "Paolo", "kind": "talk", "title": "Paolo Talk" }
{"date": "11/07/2014", "speaker": "Pavlos", "kind": "talk", "title": "Pavlos Talk" }
{"date": "11/14/2014", "speaker": "Nicolas", "kind": "talk", "title": "Nicolas Talk" }
{"date": "11/21/2014", "speaker": "Orestis", "kind": "talk", "title": "Orestis Talk" }
{"date": "11/28/2014", "speaker": "Steven", "kind": "talk", "title": "Steven Talk" }
{"date": "12/12/2014", "speaker": "Dimitris", "kind": "tutorial", "title": "Dimitris Tutorial" }

*/

db.presentations.find()
db.fall2014.find().sort({"date": -1})
db.fall2014.find().sort({"speaker": 1})
db.fall2014.findOne()
db.presentations.find().skip(2)
db.presentations.find().skip(1).limit(2)

db.presentations.find({"speaker": "Pavlos"})
db.presentations.find({"speaker": "Pavlos"}).count()
db.presentations.count({"speaker": "Pavlos"})


# Operators for Queries

# operator meaning
# $gte		greater than or equal
# $lte 		less than or equal
# $gt 		greater than
# $lt 		less than
# $or 		logical or
# $and 		logical and (implicit by commas in JSON)
# $in 		in operator
# $nin 		not_in operator
# $exists 	match docs where a property exists


db.presentations.find({"date": {$exists: true}}).count() // count docs where date exists
db.presentations.find({"date": {$exists: false}}).count() // ... where date does not exist
// find docs where date is less than "11"
db.presentations.find({"date": {$lt : "11"}})
// Find docs where the date is less than "11" or greater than or equal to "12"
db.presentations.find({$or: [{"date": {$lt: "11"}}, {"date": {$gte: "12"}}]})

db.presentations.find({$and: [{"date": {$lt: "11"}}, {"date": {$gte: "12"}}] }) // and ...
db.presentations.find({date: {$in : ["11/21/2014", "11/28/2014"]}}) // $in operator
// Common types: double: 1, string: 2, object: 3, array: 4, boolean: 8, int32: 16
db.presentations.find({"date": {$type: 2}}).count()
db.presentations.find({"date": {$type: 1}}).count()

# Projections
db.presentations.find({}, {date: 1, speaker: 1, _id: 0}).sort({"date": 1})
db.presentations.find({}, { _id: 0}).sort({"date": 1})

Arrays
var res = db.presentations.find({}, {"_id": 0, "date": 1, "speaker": 1})
var res = db.presentations.find({}, {"_id": 0, "date": 1, "speaker": 1}).sort({"date": 1}).toArray()
res.length
res[3]

# Explanations and Indices
# find the document that has _id equal to 5
db.presentations.find({"_id": 5})
db.presentations.find({"_id": 5}).explain()

db.presentations.find({"date": "11/28/2014"})
db.presentations.find({"date": "11/28/2014"}).explain()

# Indices
// Create on the fly
db.presentations.ensureIndex({"date": -1}, {"name": "dates_dsc"})
{
"createdCollectionAutomatically" : false,
"numIndexesBefore" : 1,
"numIndexesAfter" : 2,
"ok" : 1
}
> db.presentations.getIndices()

db.presentations.find({"date": "11/28/2014"})
db.presentations.find({"date": "11/28/2014"}).explain()

db.presentations.find().sort({date: 1})
db.presentations.find().sort({date: 1}).explain()

# Insertions
# db.<collection name>.insert(<document>)
var a = {"_id": 6, "date": "12/19/2014", "speaker": null}
db.presentations.insert(a);
db.getLastError() // Returns null for no error; string otherwise
db.presentations.find({})

# Updates

# db.<collection>.update(
# 	<query>,
# 	<update>,
# 	{
# 		upsert: <boolean>,
# 		multi: <boolean>,
# 		writeConcern: <document>
# }



# • query refers to the selection criteria for the update.
# • If the <update> document contains only field:value expressions then one matching document will be
replaced entirely. Otherwise, if only modifiers are present, then only the relevant fields will be updated.
# • If upsert is true and no document matches the query criteria, update() inserts a single document.
# • If multi is set to true, the update() method updates all documents that meet the <query> criteria.
# • The option writeConcern is beyond the scope of this tutorial.

# For example the following command adds a comment to our recent entry.
db.presentations.update({_id: 6}, {$set: {"comments": ["Happy holiday!"]}},{upsert: false, multi: false})
db.presentations.find({_id: 6})

# operator 	meaning
# $set 		set a field to have a specific value
# $unset 		unset a field
# $push 		push a value into an array
# $addToSet 	treat the array as a set and attempt to add the element
# $pop 		pop a value

db.presentations.update({_id: 6}, {$push: {"comments": "another comment!"}}) // push
db.presentations.find({_id: 6})
db.presentations.update({_id: 6}, {$pop: {"comments": 1}}) // pop
db.presentations.find({_id: 6})

# addToSet below
db.presentations.update({_id: 6}, {$addToSet: {"comments": "another comment!"}})
db.presentations.find({_id: 6})
db.presentations.update({_id: 6}, {$addToSet: {"comments": "another comment!"}})
db.presentations.find({_id: 6})
db.presentations.update({_id: 6}, {$unset: {"comments": true}}) // unset
db.presentations.find({_id: 6})

# Deletions / Removals
db.<collection name>.remove(<expression>)
> db.presentations.remove({"_id": 6})
> db.presentations.count()
6











