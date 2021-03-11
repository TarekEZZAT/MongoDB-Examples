' export to file with query
mongoexport -d crud -c inventory -f "item,qty" --type csv --queryFile 00120_export_json_query_030.txt -o inventory-iq-bk.csv

