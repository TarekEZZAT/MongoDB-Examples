' export to file
mongo localhost:27017/crud --eval "printjson(db.musicians.find())" > musicians-020.json
