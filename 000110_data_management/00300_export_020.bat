mongoexport --db companies --collection companies --type=csv --fieldFile companiesFieldNamesALL.txt --out companiesALL.csv
pause
mongoexport --db companies --collection companies --type=csv --fieldFile companiesFieldNames01.txt --out companies01.csv
pause

