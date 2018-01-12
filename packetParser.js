var p_data = '03000010000c2248454c4c4f48572ea8d940'

function hexChunks(hexString) {
  if(hexString.length % 2 !== 0){
    console.log('Odd numbered hex string')
    return
  }
  
  var hexArr = []
  
  for(var counter = 0; counter < hexString.length; counter+=2) {
    hexArr.push(hexString.slice(counter, counter + 2))
  }
  
  return hexArr
}

function getPayload(hexArr, bytes) {
  var payload = ''
  var payloadIndex_start = 7
  var payloadIndex_end   = hexArr.indexOf(hexArr[bytes - 7])
    
  while(payloadIndex_start < payloadIndex_end){
    payload += hexArr[payloadIndex_start]
    payloadIndex_start++
  }

  return payload
}

function packetParser(p_data){
  var hexArr = hexChunks(p_data)
  var bytes  = hexArr.length
  
  var p_obj = {
    header: hexArr[0],
    dataSize: hexArr[1] + hexArr[2] + hexArr[3],
    c: hexArr[4] + hexArr[5],
    y: hexArr[6],
    d: getPayload(hexArr, bytes),
    t: hexArr[bytes - 6] + hexArr[bytes - 5] + hexArr[bytes - 4] + hexArr[bytes - 3],
    checksum: hexArr[bytes - 2],
    terminator: hexArr[bytes - 1]
  }
  
  console.log(p_obj)
}

packetParser(p_data)
