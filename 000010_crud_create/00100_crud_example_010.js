db = db.getSiblingDB('crud')

db.coll.insert({x:1})
result = db.coll.find().toArray()
printjson(result)
db.getCollectionNames()
db.coll.drop()
