use old_db
db.getCollectionNames().forEach(function(collName) {
    db[collName].find().forEach(function(d){
        db.getSiblingDB('new_db')[collName].insert(d); 
    }) 
});