/**
  Call init() to begin parsing process.

    var x = init(packet_data)
    alert(x)

  It will first check the packet to for completeness.
  If complete, it will call packetParser.  Otherwise
  it will be sent to storage.

  Storage has a custom watcher that listens for when
  a portion of packet data is pushed to it.  When pushed
  it will attempt to join the packets in storage.

  If storage has completed packet, it will then call
  the packet parser.
**/

var storage = []
var storageListener = function(arr, callback) {
  arr.push = function(e) {
    Array.prototype.push.call(arr, e)
    callback(arr)
  }
}

storageListener(storage, function() {
  if(storage.length > 1) {
    packetConcat(storage)
  }
})

function packetConcat(arr){
  var len = arr.length
  var i   = 0
  var p   = ''
  while(i < len){
    var hexArr = hexChunks(arr.join(''))
    if(hexArr[0] == '03'){
       p += arr[i]
    }
    else if (hexArr[0] !== '03' && hexArr[bytes - 1] !== '04'){
      p += arr[i]
    }
    else if (hexArr[bytes - 1] == '04'){
      p += arr[i]
    }
    i++
 }
  var p_concat = hexChunks(p)
  var p_bytes  = p_concat.length
  if(p_concat[0] == '03' && p_concat[p_bytes - 1] == '40'){
    packetParser(p)
  }
}

function hexChunks(hexString) {
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
/**
  TODO:

  Payload indexes will change for laser model.
  Add support for laser model.
**/
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

function getPacketObj(p_data) {
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

  return p_obj
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

function init(p_data) {
  var hexArr = hexChunks(p_data)
  var bytes  = hexArr.length

  if(hexArr[0] == '03' && hexArr[bytes - 1] == '40'){
    console.log('Entire packet recieved.')
    packetParser(p_data)
  }

  if(hexArr[0] == '03' && hexArr[bytes - 1] !== '40'){
    console.log('Recieved first packet: ' + p_data)
    storage.push(p_data)
  }

  if(hexArr[0] !== '03'  && hexArr[bytes - 1] !== '40'){
    console.log('Recieved another packet: ' + p_data)
    storage.push(p_data)
  }

  if(hexArr[0] !== '03'  && hexArr[bytes - 1] == '40'){
    console.log('Recieved final packet: ' + p_data)
    storage.push(p_data)
  }
}
