// Add/Remove fields in a collection

/*
Syntax
Add field
db.collection.update({fields: "value1"}, {$set:{field2:"value1"}})
db.collection.update({_id: "value1"}, {$set:{field:"value1"}})

*/

/*    in tourists
    add/update DateOfBirth for ObjectId("5af686382857b8a7f4e2dd36")
*/
db.tourists.update({ "_id" : ObjectId("5af686382857b8a7f4e2dd36")}, {$set:{birthDate:"20/06/1990"}})

/*    in tourists
    remove DateOfBirth for ObjectId("5af686382857b8a7f4e2dd36")
*/

db.tourists.update({ "_id" : ObjectId("5af686382857b8a7f4e2dd36")}, {$unset:{birthDate:null}})

// Remove language field if empty

// test & count
db.tourists.find({ "language" : ""})
db.tourists.count({ "language" : ""})
//db.tourists.update({ "language" : ""}, {$unset:{language:null}})
db.tourists.updateMany({ "language" : ""}, {$unset:{language:null}})

// check
db.tourists.find({language: {$exists : false}})

