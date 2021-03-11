// Search Results with Weights

/*
Text search assigns a score to each document that contains the search term in the indexed fields. 

The score determines the relevance of a document to a given search query.

For a text index, the weight of an indexed field denotes the significance of the field relative to the other indexed fields in terms of the text search score.

For each indexed field in the document, MongoDB multiplies the number of matches by the weight and sums the results. Using this sum, MongoDB then calculates the score for the document. 

*******See $meta operator for details on returning and sorting by text scores.

The default weight is 1 for the indexed fields. 
To adjust the weights for the indexed fields, include the weights option in the db.collection.createIndex() method.
*/

//**** Choose the weights carefully in order to prevent the need to reindex.

/*
A collection blog has the following documents:

{
  _id: 1,
  content: "This morning I had a cup of coffee.",
  about: "beverage",
  keywords: [ "coffee" ]
}

{
  _id: 2,
  content: "Who doesn't like cake?",
  about: "food",
  keywords: [ "cake", "food", "dessert" ]
}
*/

/*
To create a text index with different field weights for the content field and the keywords field, include the weights option to the createIndex() method. 
*/

db.blog.createIndex(
   {
     content: "text",
     keywords: "text",
     about: "text"
   },
   {
     weights: {
       content: 10,
       keywords: 5
     },
     name: "TextIndex"
   }
 )

/*
The text index has the following fields and weights:

    content has a weight of 10,
    keywords has a weight of 5, and
    about has the default weight of 1.


These weights denote the relative significance of the indexed fields to each other. For instance, a term match in the content field has:

    2 times (i.e. 10:5) the impact as a term match in the keywords field and
    10 times (i.e. 10:1) the impact as a term match in the about field.
*/

use sakila
db.films.getIndexes()
db.films.dropIndex("ix_text")

db.films.createIndex(
   {
     Category: "text",
     Description: "text",
     "Actors.First name": "text",
     "Actors.Last name": "text"
   },
   {
     weights: {
       Category: 5,
       Description: 5,
	   "Actors.First name":20,
	   "Actors.Last name":20
     },
     name: "ix_text"
   }
 )
 
searchItems = "DUKAKIS"

// Does not work
db.films.find( { $text: { $search: searchItems } } ).pretty()
// Works, but does not use the index
db.films.find({Actors:searchItems})

