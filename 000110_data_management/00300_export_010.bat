// Export from mongoDB to CSV
mongoexport --host=host.example.com:port --db=samples --collection=movies -u user -p password --type csv --fields title,year,rating
pause
mongoexport --host=host.example.com:port --db=samples --collection=movies -u user -p password --type csv --fieldFile fields.txt
pause
