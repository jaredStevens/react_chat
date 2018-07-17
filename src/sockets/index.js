import *  as types from '../constants/ActionTypes'
import {addUser, messageReceived, populateUsersList} from '../actions'

const setupSocket = (dispatch, username) => {
	var url = 'wss://' + window.location.host;
	if (window.location.port == '3001') {
		url = 'ws://localhost:3000'
	}
	const socket = new WebSocket(url)

	socket.onopen = () => {
		socket.send(JSON.stringify({
			type: types.ADD_USER,
			name: username
		}))
	}
	socket.onmessage = (event) => {
		const data = JSON.parse(event.data)
		switch (data.type) {
			case types.ADD_MESSAGE:
				dispatch(messageReceived(data.message, data.author))
				break
			case types.ADD_USER:
				dispatch(addUser(data.name))
				break
			case types.USERS_LIST:
				dispatch(populateUsersList(data.users))
				break
			default:
				break
		}
	}
	return socket
}

export default setupSocket