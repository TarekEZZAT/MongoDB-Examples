/*
Update Operations
Update operations modify existing documents in a collection. 
	db.collection.updateOne() 
	db.collection.updateMany() 
	db.collection.replaceOne() 
*/

// Update syntax 

/*
db.collection.updateMany(
         <filter>,
         <update>,
         {
           upsert: <boolean>,
           writeConcern: <document>,
           collation: <document>,
           arrayFilters: [ <filterdocument1>, ... ]
         }
      )
*/	  
use crud 

db.musicians.updateMany(
	{FirstName: {$eq:"SERGUEI"}},
	{$set: {FirstName:"SERGEI"}}
)

db.musicians.updateMany(
	{_id: {$eq:313}},
	{$set: {FirstName:"SERGEI"}}
)

db.musicians.updateMany(
	{_id: {$eq:313},FirstName: {$eq:"SERGEIO"}},
	{$set: {FirstName:"SERGEIX"}}
)

db.musicians.updateMany(
	{FirstName: {$eq:"SERGEI"}},
	{$set: {address:"RUSSIA"}}
)


db.musicians.updateMany(
	{_id: {$eq:318}},
	{$set: {LastName:"THEODORAKIS"}}
)

// SIMPLIFICATION

criteria = {"FirstName" : "ROBERT", "LastName" : "SCHUMAN"}
change = {address:"GERMANY"}
 
db.musicians.updateMany(
 criteria, {$set:change}
)
