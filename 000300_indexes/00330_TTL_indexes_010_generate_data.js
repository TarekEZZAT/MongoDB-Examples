// Add 200 random documents:

for(var x=1; x<=100; x++){
  var past =  new Date()
  past.setSeconds(past.getSeconds() - (x *  60))
  // Insert a  document with timestamp in the past
  var  doc =  {
    data: 'infos',
    timestamp: past
  }
  db.ttldata.insert(doc)
  // Insert a  document with timestamp in the future
  var future =  new Date()
  future.setSeconds(future.getSeconds() +  (x *  60))
  var  doc =  {
    data: 'infos',
    timestamp: future
  }
  db.ttldata.insert(doc)
}
