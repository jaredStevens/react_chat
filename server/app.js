const express = require('express');
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8989 });
const app = express();
const PORT = process.env.PORT || 3000;
	app.set("port", PORT);
const users = [];
const broadcast = (data, ws) => {
	wss.clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN && client !== ws ) { 
			client.send(JSON.stringify(data));
		}
	});
};

wss.on('connection', (ws) => {
	let index;
	ws.on('message', (message) => {
		const data = JSON.parse(message);
		switch (data.type) {
			case 'ADD_USER': {
				index = users.length;
				users.push({ name: data.name, id: index + 1});
				ws.send(JSON.stringify({
					type: 'USERS_LIST',
					users
				}));
				broadcast({
					type: 'USERS_LIST',
					users
				}, ws);
				break;
			}
			case 'ADD_MESSAGE':
				broadcast({
					type: 'ADD_MESSAGE',
					message: data.message,
					author: data.author
				}, ws);
				break;
			default:
				break;
		}
	});

	ws.on('close', () => {
		users.splice(index, 1);
		broadcast({
			type: 'USERS_LIST',
			users
		}, ws);
	});
});

app.listen(PORT, function(){
	console.log("\n\n===== listening for requests on port " + PORT + " =====\n\n");
});

app.get('*', function(req, res, next){
	res.sendFile("/home/jared/react_chat/build/index.html");
});