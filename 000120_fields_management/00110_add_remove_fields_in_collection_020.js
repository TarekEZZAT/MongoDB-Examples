MongoDB – How to remove a field from document
By mkyong | January 29, 2015 | Viewed : 42,602 | +225 pv/w

This MongoDB article shows you how to remove a field from document and array.
1. Remove a field from Documents

Sample of document, and you want to remove the field “affLink”.
domain.json

{
      "_id" : 1,
      "domain" : "mkyong.com",
      "affLink" : "abc"
}

To remove a field from all documents, set {multi: true}, else only the field of the first matched document will be removed.

db.domain.update({},{$unset: {affLink:1}},{multi: true});
Copy

Output
domain.json

{
      "_id" : 1,
      "domain" : "mkyong.com"
}

2. Remove a field from Array

Prior to MongoDB 2.6, there is still no official function to remove a field from the array. To fix it, you need to write a script :
person.json

{
   _id: 1,
   name: "mkyong",
   addresses: [
	{
	  street: "99 The Rock Street",
	  city: "Boston",
	  state: "MA",
	  zip: "66666"
	},
	{
	  street: "88 WWF Street",
	  city: "Boston",
	  state: "MA",
	  zip: "77777"
	}
   ]
}

Loop over the documents and remove field “state” from the array one by one.

 
 db.person.find({}).forEach(function(doc) {

	var address = doc.addresses;
	for(var i = 0; i < address.length; ++i) { 
		var x = address[i];
		delete (x["state"]);
		
	}
	db.person.save(doc);

});
Copy

Output
person.json

{
   _id: 1,
   name: "mkyong",
   addresses: [
	{
	  street: "99 The Rock Street",
	  city: "Boston",
	  zip: "66666"
	},
	{
	  street: "88 WWF Street",
	  city: "Boston",
	  zip: "77777"
	}
   ]
}

References

    MongoDB : $unset
    MongoDB : Modify documents
    MongoDB : Query document, Array

array mongodb remove field
About the Author
author image	
mkyong
Founder of Mkyong.com, love Java and open source stuff. Follow him on Twitter, or befriend him on Facebook or Google Plus. If you like my tutorials, consider make a donation to these charities.
Comments
Leave a R