import React, { Component } from 'react';
import io from 'socket.io-client'
import { USER_CONNECTED, LOGOUT } from '../Events'
import LoginForm from './LoginForm'
import ChatContainer from './chats/ChatContainer'
import VideoContainer from './VideoContainer'
import config from 'react-global-configuration';
export default class Layout extends Component {

	constructor(props) {
	  super(props);
	  this.state = {
			socketUrl : "http://" + config.get('serverIp') + ":3231",
	  	socket:null,
	  	user:null
	  };
	}

	componentWillMount() {
		this.initSocket()
	}

	/*
	*	Connect to and initializes the socket.
	*/
	initSocket = ()=>{
		const socket = io(this.state.socketUrl)

		socket.on('connect', ()=>{
			console.log("Connected");
		})

		this.setState({socket})
	}

	/*
	* 	Sets the user property in state
	*	@param user {id:number, name:string}
	*/
	setUser = (user)=>{
		const { socket } = this.state
		socket.emit(USER_CONNECTED, user);
		this.setState({user})
	}

	/*
	*	Sets the user property in state to null.
	*/
	logout = ()=>{
		const { socket } = this.state
		socket.emit(LOGOUT)
		this.setState({user:null})

	}


	render() {
		const { title } = this.props
		const { socket, user } = this.state
		return (
			<div className='body-container'>
				<VideoContainer streamId={this.props.match.params.streamId}/>
				<div className="chat-container">
					{
						!user ?
						<LoginForm socket={socket} setUser={this.setUser} />
						:
						<ChatContainer socket={socket} user={user} logout={this.logout}/>
					}
				</div>
			</div>
		);
	}
}
