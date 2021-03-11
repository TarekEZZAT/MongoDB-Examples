// Copy collection from db to db
/*
Syntax
db.<collection_name>.find().forEach(function(d){ db.getSiblingDB('<new_database>')['<collection_name>'].insert(d); });
*/
db.Sakila_actors.find().forEach(function(d){ db.getSiblingDB('sakila')['actors'].insert(d); });
db.Sakila_customers.find().forEach(function(d){ db.getSiblingDB('sakila')['customers'].insert(d); });
db.Sakila_films.find().forEach(function(d){ db.getSiblingDB('sakila')['films'].insert(d); });
