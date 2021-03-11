// Specify Equality Condition¶
use Sakila
db.Sakila_films.find({Category:'Sports'})
db.Sakila_films.find({'Actors.Last name':'MARX'})

// OR operator
db.Sakila_films.find({$or:[{"Category":'Sports'},{"Category":'Drama'}]})
db.Sakila_films.find({$or:[{'Category':'Sports'},{'Actors.Last name':'MARX'}]})

// AND operator
db.Sakila_films.find({'Actors.Last name':'MARX',Category:'Sports'})
db.Sakila_films.find({$and:[{'Category':'Sports'},{'Actors.Last name':'MARX'}]})

// IN operator
db.Sakila_films.find({Category: {$in: [ 'Action', 'Foreign', 'Family']}}).pretty()



// Combinations
db.Sakila_films.find({Category: {$in: [ 'Action', 'Foreign', 'Family']},'Actors.Last name': 'HOPKINS'}).pretty()

// Alternative syntax
db.getCollection('Sakila_films').find({$and:[{Rating:"G"},{length:48}]})