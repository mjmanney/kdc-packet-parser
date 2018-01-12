//
//  Dependencies
//
var request = require('request')
var G       = require('../G')
//
//  Chain promises from connection => write instruction => open notifcations 
//

var init = (req, res) => {
	var node  = req.body.mac
	var token = G.TOKEN.ACCESS_TOKEN
	const MAC = G.MAC.C1000
	
	var options_connect = {
		url: "http://demo20.cassia.pro/api/gap/nodes" + node
			+ "/connection?mac=" + MAC
			+ "&access_token=" + token,
		method: 'POST',
		form: {
			type: 'random'
		}
	}
	
	var options_write = {
		url: "http://demo20.cassia.pro/api/gatt/nodes/" + node
			+ "handle/19/value/0100/?"
			+ "mac=" + MAC
			+ "&access_token=" + token,
		method: "GET",
	}

	function requestConnection(err, res, body) {
		console.log("P1: Requestion connection to KDC: " + node)
		if(err || body == 'Not Found' || body == 'connect failed or timeout') return (err || body)
		else return body
	}

	function onConnection(response) {
		console.log('Connection status:' + response)
		console.log('Requesting Write Instruction...')
		
		return new Promise((resolve, reject) => {
			request(options_write, requestWriteInstruction)
		})
	}
	
	function requestWriteInstruction(err, res, body) {
		if(err) reject(err)
		else resolve(body)
	}
	
	function onWrite(response) {
		console.log("Write Instruction status: " + response)
		res.status(200).send("KDC" + node + " is connected. Write instruction is OK.")
	}

	var p1 = new Promise((resolve, reject) => {
		console.log("P1: Requesting connection to KDC: " + node)
		request(options_connect, (err, res, body) => {
			if(err || body == 'Not Found' || body == 'connect failed or timeout') reject (err || body)
			else resolve(body)
		})
	})
	
	var p2 = p1.then(onConnect => {
		console.log("Connection status: " + onConnect)
		console.log("P2: Requesting write instruction")
		
		request(options_write, (err, res, body) => {
			if(err) reject(err)
			else resolve(body)
		})
	})
	
	var p3 = p2.then(onWrite => {
		console.log("Write instruction status: " + onWrite)
		res.send('Request finished...')
	})

}

module.exports = init