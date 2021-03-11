Indexes

use sakila

db.actors.findOne()
/* 
{
        "_id" : 2,
        "FirstName" : "NICK",
        "LastName" : "WAHLBERG",
        "phone" : "XXX-XXXX-XXX",
        "address" : "XXXXXXXXXXXXXXXXXXXXXXXXXXXX"
}
*/

filter = {LastName:"WOOD"}
db.actors.find(filter)
db.actors.find(filter)explain('executionStats')
/*
 db.actors.find(criteria).explain("executionStats")
{
        "queryPlanner" : {
                "plannerVersion" : 1,
                "namespace" : "sakila.actors",
                "indexFilterSet" : false,
                "parsedQuery" : {
                        "LastName" : {
                                "$eq" : "WOOD"
                        }
                },
                "winningPlan" : {
                        "stage" : "COLLSCAN",
                        "filter" : {
                                "LastName" : {
                                        "$eq" : "WOOD"
                                }
                        },
                        "direction" : "forward"
                },
                "rejectedPlans" : [ ]
        },
        "executionStats" : {
                "executionSuccess" : true,
                "nReturned" : 2,
                "executionTimeMillis" : 48,
                "totalKeysExamined" : 0,
                "totalDocsExamined" : 200,
                "executionStages" : {
                        "stage" : "COLLSCAN",
                        "filter" : {
                                "LastName" : {
                                        "$eq" : "WOOD"
                                }
                        },
                        "nReturned" : 2,
                        "executionTimeMillisEstimate" : 0,
                        "works" : 202,
                        "advanced" : 2,
                        "needTime" : 199,
                        "needYield" : 0,
                        "saveState" : 1,
                        "restoreState" : 1,
                        "isEOF" : 1,
                        "invalidates" : 0,
                        "direction" : "forward",
                        "docsExamined" : 200
                }
        },
        "serverInfo" : {
                "host" : "HORUS",
                "port" : 27017,
                "version" : "3.4.10",
                "gitVersion" : "078f28920cb24de0dd479b5ea6c66c644f6326e9"
        },
        "ok" : 1
}
*/
db.actors.find(filter).explain('queryPlanner')
/*
{
        "queryPlanner" : {
                "plannerVersion" : 1,
                "namespace" : "sakila.actors",
                "indexFilterSet" : false,
                "parsedQuery" : {
                        "LastName" : {
                                "$eq" : "WOOD"
                        }
                },
                "winningPlan" : {
                        "stage" : "COLLSCAN",
                        "filter" : {
                                "LastName" : {
                                        "$eq" : "WOOD"
                                }
                        },
                        "direction" : "forward"
                },
                "rejectedPlans" : [ ]
        },
        "serverInfo" : {
                "host" : "HORUS",
                "port" : 27017,
                "version" : "3.4.10",
                "gitVersion" : "078f28920cb24de0dd479b5ea6c66c644f6326e9"
        },
        "ok" : 1
}
*/
db.actors.find(filter).explain('allPlansExecution')
/*
{
        "queryPlanner" : {
                "plannerVersion" : 1,
                "namespace" : "sakila.actors",
                "indexFilterSet" : false,
                "parsedQuery" : {
                        "LastName" : {
                                "$eq" : "WOOD"
                        }
                },
                "winningPlan" : {
                        "stage" : "COLLSCAN",
                        "filter" : {
                                "LastName" : {
                                        "$eq" : "WOOD"
                                }
                        },
                        "direction" : "forward"
                },
                "rejectedPlans" : [ ]
        },
        "executionStats" : {
                "executionSuccess" : true,
                "nReturned" : 2,
                "executionTimeMillis" : 0,
                "totalKeysExamined" : 0,
                "totalDocsExamined" : 200,
                "executionStages" : {
                        "stage" : "COLLSCAN",
                        "filter" : {
                                "LastName" : {
                                        "$eq" : "WOOD"
                                }
                        },
                        "nReturned" : 2,
                        "executionTimeMillisEstimate" : 0,
                        "works" : 202,
                        "advanced" : 2,
                        "needTime" : 199,
                        "needYield" : 0,
                        "saveState" : 1,
                        "restoreState" : 1,
                        "isEOF" : 1,
                        "invalidates" : 0,
                        "direction" : "forward",
                        "docsExamined" : 200
                },
                "allPlansExecution" : [ ]
        },
        "serverInfo" : {
                "host" : "HORUS",
                "port" : 27017,
                "version" : "3.4.10",
                "gitVersion" : "078f28920cb24de0dd479b5ea6c66c644f6326e9"
        },
        "ok" : 1
}
*/
db.actors.createIndex({LastName:1});
db.actors.find(filter)explain('executionStats')
/*
{
        "queryPlanner" : {
                "plannerVersion" : 1,
                "namespace" : "sakila.actors",
                "indexFilterSet" : false,
                "parsedQuery" : {
                        "LastName" : {
                                "$eq" : "WOOD"
                        }
                },
                "winningPlan" : {
                        "stage" : "FETCH",
                        "inputStage" : {
                                "stage" : "IXSCAN",
                                "keyPattern" : {
                                        "LastName" : 1
                                },
                                "indexName" : "LastName_1",
                                "isMultiKey" : false,
                                "multiKeyPaths" : {
                                        "LastName" : [ ]
                                },
                                "isUnique" : false,
                                "isSparse" : false,
                                "isPartial" : false,
                                "indexVersion" : 2,
                                "direction" : "forward",
                                "indexBounds" : {
                                        "LastName" : [
                                                "[\"WOOD\", \"WOOD\"]"
                                        ]
                                }
                        }
                },
                "rejectedPlans" : [ ]
        },
        "executionStats" : {
                "executionSuccess" : true,
                "nReturned" : 2,
                "executionTimeMillis" : 73,
                "totalKeysExamined" : 2,
                "totalDocsExamined" : 2,
                "executionStages" : {
                        "stage" : "FETCH",
                        "nReturned" : 2,
                        "executionTimeMillisEstimate" : 0,
                        "works" : 3,
                        "advanced" : 2,
                        "needTime" : 0,
                        "needYield" : 0,
                        "saveState" : 0,
                        "restoreState" : 0,
                        "isEOF" : 1,
                        "invalidates" : 0,
                        "docsExamined" : 2,
                        "alreadyHasObj" : 0,
                        "inputStage" : {
                                "stage" : "IXSCAN",
                                "nReturned" : 2,
                                "executionTimeMillisEstimate" : 0,
                                "works" : 3,
                                "advanced" : 2,
                                "needTime" : 0,
                                "needYield" : 0,
                                "saveState" : 0,
                                "restoreState" : 0,
                                "isEOF" : 1,
                                "invalidates" : 0,
                                "keyPattern" : {
                                        "LastName" : 1
                                },
                                "indexName" : "LastName_1",
                                "isMultiKey" : false,
                                "multiKeyPaths" : {
                                        "LastName" : [ ]
                                },
                                "isUnique" : false,
                                "isSparse" : false,
                                "isPartial" : false,
                                "indexVersion" : 2,
                                "direction" : "forward",
                                "indexBounds" : {
                                        "LastName" : [
                                                "[\"WOOD\", \"WOOD\"]"
                                        ]
                                },
                                "keysExamined" : 2,
                                "seeks" : 1,
                                "dupsTested" : 0,
                                "dupsDropped" : 0,
                                "seenInvalidated" : 0
                        }
                }
        },
        "serverInfo" : {
                "host" : "HORUS",
                "port" : 27017,
                "version" : "3.4.10",
                "gitVersion" : "078f28920cb24de0dd479b5ea6c66c644f6326e9"
        },
        "ok" : 1
}
*/
db.actors.find(filter).explain('queryPlanner')
/*
{
        "queryPlanner" : {
                "plannerVersion" : 1,
                "namespace" : "sakila.actors",
                "indexFilterSet" : false,
                "parsedQuery" : {
                        "LastName" : {
                                "$eq" : "WOOD"
                        }
                },
                "winningPlan" : {
                        "stage" : "FETCH",
                        "inputStage" : {
                                "stage" : "IXSCAN",
                                "keyPattern" : {
                                        "LastName" : 1
                                },
                                "indexName" : "LastName_1",
                                "isMultiKey" : false,
                                "multiKeyPaths" : {
                                        "LastName" : [ ]
                                },
                                "isUnique" : false,
                                "isSparse" : false,
                                "isPartial" : false,
                                "indexVersion" : 2,
                                "direction" : "forward",
                                "indexBounds" : {
                                        "LastName" : [
                                                "[\"WOOD\", \"WOOD\"]"
                                        ]
                                }
                        }
                },
                "rejectedPlans" : [ ]
        },
        "serverInfo" : {
                "host" : "HORUS",
                "port" : 27017,
                "version" : "3.4.10",
                "gitVersion" : "078f28920cb24de0dd479b5ea6c66c644f6326e9"
        },
        "ok" : 1
}
*/
db.actors.find(filter).explain('allPlansExecution')
/*
{
        "queryPlanner" : {
                "plannerVersion" : 1,
                "namespace" : "sakila.actors",
                "indexFilterSet" : false,
                "parsedQuery" : {
                        "LastName" : {
                                "$eq" : "WOOD"
                        }
                },
                "winningPlan" : {
                        "stage" : "FETCH",
                        "inputStage" : {
                                "stage" : "IXSCAN",
                                "keyPattern" : {
                                        "LastName" : 1
                                },
                                "indexName" : "LastName_1",
                                "isMultiKey" : false,
                                "multiKeyPaths" : {
                                        "LastName" : [ ]
                                },
                                "isUnique" : false,
                                "isSparse" : false,
                                "isPartial" : false,
                                "indexVersion" : 2,
                                "direction" : "forward",
                                "indexBounds" : {
                                        "LastName" : [
                                                "[\"WOOD\", \"WOOD\"]"
                                        ]
                                }
                        }
                },
                "rejectedPlans" : [ ]
        },
        "executionStats" : {
                "executionSuccess" : true,
                "nReturned" : 2,
                "executionTimeMillis" : 0,
                "totalKeysExamined" : 2,
                "totalDocsExamined" : 2,
                "executionStages" : {
                        "stage" : "FETCH",
                        "nReturned" : 2,
                        "executionTimeMillisEstimate" : 0,
                        "works" : 3,
                        "advanced" : 2,
                        "needTime" : 0,
                        "needYield" : 0,
                        "saveState" : 0,
                        "restoreState" : 0,
                        "isEOF" : 1,
                        "invalidates" : 0,
                        "docsExamined" : 2,
                        "alreadyHasObj" : 0,
                        "inputStage" : {
                                "stage" : "IXSCAN",
                                "nReturned" : 2,
                                "executionTimeMillisEstimate" : 0,
                                "works" : 3,
                                "advanced" : 2,
                                "needTime" : 0,
                                "needYield" : 0,
                                "saveState" : 0,
                                "restoreState" : 0,
                                "isEOF" : 1,
                                "invalidates" : 0,
                                "keyPattern" : {
                                        "LastName" : 1
                                },
                                "indexName" : "LastName_1",
                                "isMultiKey" : false,
                                "multiKeyPaths" : {
                                        "LastName" : [ ]
                                },
                                "isUnique" : false,
                                "isSparse" : false,
                                "isPartial" : false,
                                "indexVersion" : 2,
                                "direction" : "forward",
                                "indexBounds" : {
                                        "LastName" : [
                                                "[\"WOOD\", \"WOOD\"]"
                                        ]
                                },
                                "keysExamined" : 2,
                                "seeks" : 1,
                                "dupsTested" : 0,
                                "dupsDropped" : 0,
                                "seenInvalidated" : 0
                        }
                },
                "allPlansExecution" : [ ]
        },
        "serverInfo" : {
                "host" : "HORUS",
                "port" : 27017,
                "version" : "3.4.10",
                "gitVersion" : "078f28920cb24de0dd479b5ea6c66c644f6326e9"
        },
        "ok" : 1
}
*/
//-------
db.actors.getIndexes()
db.actors.dropIndex("LastName_1")
db.actors.createIndex({'LastName':1}, {name: 'ix_LastName'})
db.actors.getIndexes()
db.actors.reIndex('ix_LastName')
