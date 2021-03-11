// Start configuration server
//mongo localhost:27019
rs.initiate()
rs.status()['configsvrA']