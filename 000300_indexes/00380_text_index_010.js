// Text Indexes


use sakila

db.films.createIndex( { Title: "text",  Category: "text" , Description: "text" }, {name:"ix_text"} )

/*
db.films.createIndex( { Title: "text",  Actors : "text" , Description: "text" } )
Actors is an array (does not work)
*/

/*
{
    "createdCollectionAutomatically" : false,
    "numIndexesBefore" : 1,
    "numIndexesAfter" : 2,
    "ok" : 1
}
*/
/*
Prepare search items.

Multiple elements which needs to be searched could be included in the search items.
Following table gives an idea of how to prepare search items.

Search Items	       ==>> Description
"item_1 item_2 item_3"	    The three items are considered different and affect the text matching score individually and positively.
"item_1 item_2 -item_3"	    Those field values that has item_3, would be excluded in the result.
"item_1 /"item_2 item_3/""	"item_2 item_3" is considered a single item.
*/

/*
Text Search.

$text query operator is used to search the collection in the text indexed fields for the search items.
Following is the command bringing everything needed together for $text query operation

db.collection.find( { $text: { $search: searchItems } } )
*/
 
 
searchItems = "Drama"
db.films.find( { $text: { $search: searchItems } } ).pretty()
