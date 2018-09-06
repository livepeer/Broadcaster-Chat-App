## A Livepeer Broadcasters End to End Tutorial
### Table of Contents
* Introduction/Ecosystem Explanation
* Simple Livepeer Video Player
* Livepeer Chat App
* Deploy the Chat App

### Introduction
This tutorial will show you the power of livepeer and how you as a web developer might be able to leverage the platform to enhance the decentralized streaming ecosystem.  

Topics Covered:
- React
- Livepeer.js
- Node
- Websockets
- AWS EC2
- Metamask
- Ethereum
- Rinkeby Testnet
- Video Streaming using OBS
- RTMP Protocol
- HLS.JS
- The Livepeer Player
- HTTP Live Streaming (HLS) and the m3u8 format

To wrap your head around how Livepeer fits into the video streaming ecosystem let's first take a look at a video streaming diagram and consider all the pieces of the stack required to stream/play a video.
![livepeer network flow](https://i.imgur.com/PDioPnY.png)

As you can see, we need something to capture the video and send it to the Livepeer network/a livepeer node.  The Livepeer node consists of the [Livepeer Media Server] (https://github.com/livepeer/wiki/wiki/Livepeer-Media-Server) and Ethereum code which connects to a network of Livepeer nodes who will transcode the stream.

If we'd like our stream to be accessible to anyone on the public internet, we'll need to run a server that has a publicly accessible IP address like an AWS EC2 instance.  Otherwise, most computers sit on a local network that is not reachable by people not connected to the same router.  If you're at a hackathon you can bind the node to port 0.0.0.0 rather than localhost so other people on the same network can reach your stream.  

### Simple Livepeer Video Player

The best way to understand all of this is to [create the simplest webpage that can play a livepeer stream](https://github.com/blake41/livepeer-simple-video-player).  If you'd like to just clone the code feel free to clone that working repo and just edit the source of the video.  Or you can start from scratch and follow the instructions below.

Before we create the client code, let's set up a stream.  
[Follow the guides to set up a node and broadcast](https://github.com/livepeer/wiki/wiki/Blueprint:-set-up-a-broadcasting-node-using-Livepeer-and-OBS)
You should see your stream id in the console log in the Livepeer node terminal window, but you can always curl the server ```curl http://localhost:7935/manifestID``` to get the streamId.  Note (on my terminal) it prints out with a percent sign on the end, DO NOT include that in your stream id.

We can use the Livepeer player but to understand what's happening, let's build our own.  Currently most browsers don't support HLS in a standard HTML5 video tag, so we'll need to use a library to help us play the stream.  For that we'll use [HLS.js](https://github.com/video-dev/hls.js/).  [Google Chrome no longer allows videos to autoplay](https://developers.google.com/web/updates/2017/09/autoplay-policy-changes) so we'll need to add a button to manually allow the stream to start.  
On our html page, we'll load the hls Javascript file, our local javascript file we're calling hlsplayer.js, our css and we'll have a div that contains our video element.  

In our Javascript, we need to do a few things:
- hard code our streamID (which can be found by running ```curl http://localhost:7935/manifestID``` which will request the streamId from the livepeer node)
- Set our source to be 'http://localhost:7935/stream/' + streamId + '.m3u8'
- Create a new instance of HLS,
  - load the source
  - attach the player to the video element
- Lastly, let's create a function that runs onLoad which attaches a click handler which runs the HLS play function

If you have your livepeer node running, and a stream coming from obs, you should be able to click the play button and see your stream!  

Rather than starting from scratch, we could have used the [livepeer.js react component](https://github.com/livepeer/livepeerjs/tree/master/packages/chroma) to play the video, which is a React component wrapped around HLS.js.

### Livepeer Chat Application

#### Note: For the next section of the tutorial, the code included in this repo should be ready to clone and run, so feel free to use that as a reference or create a new repository and follow along as we build the chat app.

Now that we know how to play video using livepeer, let's build a client experience that's a bit richer than currently exists.  Imagine you're streaming video where a presenter is communicating with an in person audience as well as an online audience.  It would be great if the presenter could take questions/interact with the folks online.  Let's add a chatroom into the client app next to the live video stream.  Since we're already in the Ethereum ecosystem, it would also be great to allow consumers of the stream to tip the broadcaster natively in ETH.  Lastly, we'd like to use the Livepeer SDK to estimate how much it's costing us to stream our video content.  

Since the focus of this tutorial is not building a chat app, let's use an open source websocket powered chatroom and add livepeer to it.  

#### [Clone this repository as the base of our application](https://github.com/vlw0052/Tutorial---ReactJS-and-Socket.io-Chat-App)

#### Note: This repo is built with create-react-app and will serve as the scaffolding of our project.

Once we have our react app, run `npm install` to install our dependencies and work on adding livepeer.

Layout.js is our main insertion point for our react app.  Let's add another component to it that will render our Livepeer video feed.  

```jsx
render() {
  const { title } = this.props
  const { socket, user } = this.state
  const broadcaster = config.get('broadcasterInfo')
  return (
    <div className='body-container'>
      <div className='stream-header-container'>
        <div className='stream-title default-font'>{broadcaster.title}</div>
        <img className='globe-icon' src='/images/globe.png'></img>
        <div className='broadcaster-info-container default-font default-font-color'>
          <div className='broadcasters-name'>{`${broadcaster.firstName} ${broadcaster.lastName}`}</div>
          <div className='broadcasters-city'>{`${broadcaster.city},`}</div>
          <div className='broadcasters-country'>{broadcaster.country}</div>
        </div>
      </div>
      <div className="main-body-container">
        <VideoContainer streamId={this.props.match.params.streamId}
          connectedUsers={this.state.connectedUsers}
        />
        <div className="chat-container">
          <div className="chat-container-inner">
            <div className='stream-count-container'>
              <img src='/images/users.png' className='users-logo'></img>
              <div className='stream-count default-font default-font-color'>
                {`Viewers: ${Object.keys(this.state.connectedUsers).length}`}
              </div>
            </div>
            {
              !user ?
              <LoginForm socket={socket} setUser={this.setUser} />
              :
              <ChatContainer socket={socket} user={user} logout={this.logout}/>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
```  

We'll pass in a streamId that we can hardcode for now just to get it working that we'll later replace with a dynamic prop pulled from a url param.

```jsx
import React, { Component } from 'react';
import ReactHLS from 'react-hls';
import config from 'react-global-configuration';

class VideoContainer extends Component {

	source() {
		return `http://${config.get('serverIp')}:7935/stream/${this.props.streamId}.m3u8`
	}

  render() {
    return(
      <div className='left-container'>
        <div className="video-container">
          <ReactHLS url={this.source()} />
        </div>
      </div>
    )
  }

}

export default VideoContainer
```

In our VideoContainer component, let's use a react HLS component to display the video we're streaming through Livepeer.  We'll layout the screen so that the video div takes up the left half of the screen and our chat box is the right half.  We'll use react-global-configuration to read in a config file where we'll store the IP address we're going to run our node on (for now our localhost) and our source function will combine that with our streamId to construct the URL that livepeer streams over.

Here's the css we'll add
```css

.video-container {
  width: 100%;
  height: 100%;
  text-align: center;
}

.tip-container {
  text-align: center;
}

.stream-info-container {
  text-align: center;
}

.tip-button {
  width: 304px;
  height: 89px;
  background-size: 100%;
  background-image: url('images/1_pay_mm_off.png');
  cursor: pointer;
}

.left-container {
  height: 100%;
  display: inline-block;
  width: 50%;
  vertical-align: top;
}

.tip-button:hover {
  background-image: url('images/1_pay_mm_over.png');
}

.tip-button:active {
  background-image: url('images/1_pay_mm_off.png');
}

.body-container {
  height: 84%;
}

.chat-container {
  width: 50%;
  display: inline-block;
  height: 100%;
  vertical-align: top;
}
```

Let's create a config.js file in the root directory with the following info:
```js
const config = {
    serverIp: 'localhost',
    ethTipAddress: '0xf17f52151ebef6c7334fad080c5704d77216b732',
    broadcasterInfo: {
      ETHAddress: '0xa452a1824ac4609Ab93d8b8a442b04847a6Aee01',
      FirstName: 'Blake',
      LastName: 'Johnson'
    },
    provider : "https://rinkeby.infura.io",
    controllerAddress : "0x37dC71366Ec655093b9930bc816E16e6b587F968"
};
export default config;
```
Put the ETH address in of your livepeer node.  You can get that info from the livepeer cli if you forgot it.  We'll need it later.  Put in any address you'd like consumers of your stream to tip you at.  The provider and controller address we'll use when we instantiate the livepeer sdk.

Now that we have our config file setup let's edit the Layout.js file to use our config file

```jsx
constructor(props) {
  super(props);
  this.state = {
    socketUrl : "http://" + config.get('serverIp') + ":3231",
    socket:null,
    user:null
  };
}
```

We should be able to stream our feed now and use our chatroom.  Try running ```npm start```.

You'll need to open up obs, and hit start streaming.  You'll need to have your livepeer node running on rinkeby and have grabbed the manifestId.  In Layout.js make sure you put in your manifestId and the streamId prop we're passing to VideoContainer.  If all that is working, navigate to the root route at http://localhost:3000, try our chatroom, and hit play to see your stream!

Now that we have our chatroom and streaming working, let's add the ability to tip someone.  Add a TipContainer component to our VideoContainer.

```jsx
render() {
  return(
    <div className='left-container'>
      <div className="video-container">
        <ReactHLS url={this.source()} />
      </div>
      <TipContainer />
    </div>
  )
}
```

Our TipContainer will look like This

```jsx
import React, { Component } from 'react';
import Web3 from 'web3'
import config from 'react-global-configuration';

class TipContainer extends Component {
	constructor(props) {
	  super(props);
	}

  handleClick() {
		var user_address = undefined;
    if (typeof web3 === 'undefined') {
      return alert('You need to install MetaMask to use this feature.  https://metamask.io')
    }
		var localWeb3 = new Web3(window.web3.currentProvider)
		const getAccount = async () => {
	  	const accounts = await localWeb3.eth.getAccounts();
			return accounts[0]
		};
		const sendEth = async () => {
			user_address  = await getAccount()
			if(user_address === undefined) {
				alert('please unlock metamask by inputting your password')
				return false
			}
			localWeb3.eth.sendTransaction({
	      to: config.get('ethTipAddress'),
	      from: user_address,
	      value: localWeb3.utils.toWei('1', 'wei'),
	    }, function (err, transactionHash) {
	      if (err) return console.log('Oh no!: ' + err.message)
	      console.log('Thanks!')
	    })
		}
		sendEth()
  }

	render() {
		return (
      <div className="tip-container">
        <div className="tip-button" onClick={this.handleClick}></div>
      </div>
		);
	}
}

export default TipContainer
```

Let's dig into what's going on.  First let's npm install --save web3 which will import the web3 library which allows us to communicate with the ethereum network via metamask.  Either send yourself some ETH or request more test ETH for it from the faucet.

When a user clicks on our tip button we need to do a number of things:

- Get the web3 object metamask injects and wrap it into the 1.X.X version of the web3 library we installed.
- Get the address of the consumers' metamask account
- Handle two error cases:
  - metamask not installed
  - metamask not unlocked
- If everything is set, create a transaction where the user sends ETH from their metamask address to the address the broadcaster input into their config file.

For now we'll hardcode 1 wei as the amount a user can tip.
You can find the images for the metamask tip button in the github repo.
Try reloading the application and sending a tip!

We've now implemented a chatroom, live video streaming, and the ability to tip the broadcaster.  The last thing we'd like to do is communicate with the livepeer protocol via the Javascript SDK.  We'd like to be able to estimate for a broadcaster how much they're spending to transcode their stream.

Let's add a StreamInfo component to our VideoContainer component and pass along the streamId.

```jsx
  render() {
    return(
      <div className='left-container'>
        <div className="video-container">
          <ReactHLS url={this.source()} />
        </div>
        <TipContainer />
        <StreamInfo streamId={this.props.streamId}/>
      </div>
    )
  }
```

```jsx
  import LivepeerSDK from '@livepeer/sdk'
  import React, { Component } from 'react';
  import config from 'react-global-configuration';

  class StreamInfo extends Component {
  	constructor(props) {
  	  super(props);
  		this.state = {pricePerSegment: null, secondsElapsed: 0}
  		this.totalBroadcastPrice = this.totalBroadcastPrice.bind(this);
  	}

    componentDidMount() {
  		var self = this;
  		LivepeerSDK({ provider: config.get('provider'), controllerAddress: config.get('controllerAddress') }).then(async sdk => {
  		  const { rpc } = sdk
  		  const jobs = await rpc.getJobs({ broadcaster: config.get('ETHAddress')})
  			const job = jobs.filter(job => job.streamId.substring(0,132) == this.props.streamId)
  			const jobObject = await rpc.getJob(job[0].id)
  			const transcoder = await rpc.getTranscoder(jobObject.transcoder)
  			self.setState({pricePerSegment: transcoder.pricePerSegment})
  		})
  		setInterval(function(){ self.setState({secondsElapsed: self.state.secondsElapsed + 1}) }, 1000);
    }

  	totalBroadcastPrice() {
  		return this.state.pricePerSegment * this.state.secondsElapsed
  	}

  	render() {
  		return (
      	<div className='stream-info-container'>
  				<div>{`The price for each 4 second segment is: ${this.state.pricePerSegment}`}</div>
  				<div>{`The cost to transcode this broadcast since you've been connected is: ${this.totalBroadcastPrice()}`}</div>
  			</div>
  		);
  	}
  }

  export default StreamInfo

```

In this component we need to do a few things:
- create our default state where we'll store the price per segment the transcoder charges and the amount of seconds that have passed
- on component mounting
  - instantiate the Livepeer SDK with the provider and controller address (so we can use on the rinkeby testnet)
  - use the getjobs method to retrieve all jobs our ETH broadcaster address has associated with it
  - filter the array for the right job.  We have the manifestId but need to compare with the streamId.  The streamId contains the manifestId in the first 132 characters and then has some additional video profile information appended after.
  - call the getJob method to get more information about the job using it's jobId
  - call the getTranscoder method with the transcoder address we got from the getJob method
  - set the pricePerSegment state with the value we got back from the transcoder
  - create a seconds counter with setInterval
- create a method to calculate the total estimated cost of the broadcast since the client has started watching the stream
- render the price per segment and the total cost


## Moving to a publicly accessible server
Running a node locally is great, and anyone on your local network will be able to connect to your local IP but if you'd like to stream to the public internet you'll need to run a node on a server with a public IP address.  We'll use EC2 (but feel free to use any server you choose)  

We'll need to do the same setup we did to run the livepeer node locally.  Follow the same instructions to download the livepeer node, request test ETH and request LPT.  We'll change our OBS streaming destination to have our EC2 instances public IP address. ```rtmp://my.ip.address.ec2:1935/movie```.  Make sure to change the security settings to open the following ports.
- 1935 (for livepeer)
- 3000 (for our react app)
- 3231 (for our websockets)
- 7935 (for livepeer)
Note: when we boot up our livepeer node on the ec2 instance we'll need to boot up the livepeer node with the ```--rtmpAddr 0.0.0.0 and -httpAddr 0.0.0.0``` flags

Pull down your repo, ```npm install```, ```npm start``` and you should be able to see the client at http://yourip:3000/mystreamid in the browser!

You can get mystreamid by curling from the shell ```curl http://localhost:7935/manifestID``` on the server.
