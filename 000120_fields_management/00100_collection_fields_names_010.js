// List all keys in a collection
/*
    var dataKeys = db.collection.findOne();
    for (var key in dataKeys) { print (key) ; }
*/
   use sakila
   var dataKeys = db.films.findOne();
    for (var key in dataKeys) { print (key) ; }	
	
	