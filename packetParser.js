var p_data = '03000010000c2248454c4c4f48572ea8d940'

function hexChunks(hexString) {
  //  Parameter check
  if(typeof hexString !== 'string'){
    throw new Error('Invalid parameter.  Expecting string, recieved ' + typeof hexString + '.')
  }
  else if(hexString.length % 2 !== 0){
    throw new Error('Invalid parameter.  Expecting even length string.  0x should be removed from hex.')
  }
  
  var hexArr = []
  for(var counter = 0; counter < hexString.length; counter+=2) {
    hexArr.push(hexString.slice(counter, counter + 2))
  }

  return hexArr
}

//  payload indexes will be different for laser model
function getPayload(hexArr, bytes) {
  var payload = ''
  var payloadIndex_start = 7
  var payloadIndex_end   = hexArr.indexOf(hexArr[bytes - 7])
    
  while(payloadIndex_start <= payloadIndex_end){
    payload += hexArr[payloadIndex_start]
    payloadIndex_start++
  }

  return payload
}

function getPacketObj(p_data){
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
    terminator: hexArr[bytes - 1],
    complete: false
  }
  
  /**  The data that is transmitted over bluetooth is usually split into pieces.
       This logic checks for a completed packet.  This might have to be moved to
       its own function, which collects an entire packet from multiple messages.
  
  if(p_obj.header == '03' && p_obj.terminator == '40'){
    console.log('Entire packet recieved.')
    p_obj.complete = true
    return p_obj
  } 
  else if(p_obj.header == '03' && p_obj.terminator !== '40'){
    console.log('First packet chunk recieved...')
  }
  else if(p_obj.header !== '03' && p_obj.terminator !== '40'){
    console.log('Recieved another packet...')
  }
  else if(p_obj.header !== '03' && p_obj.terminator == '40'){
    console.log('Last packet recieved.')
  } else {
    throw new Error('Something went wrong during the transmission.')
  }

   /**/
}

function htoa(hexCode) {
    var hex = hexCode.toString()
    var str = ''
    
    for (var i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
        
    }   
    return str
}

function packetParser(p_data){
  var packet = getPacketObj(p_data)
  var payload = packet.d
  var hexArr  = hexChunks(payload)
  var decoded = hexArr.map(htoa).join('')
  
  return decoded
}

var x = packetParser(p_data)
console.log(x)
