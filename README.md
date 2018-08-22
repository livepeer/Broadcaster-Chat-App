``` npm run react ``` to start React dev server.
``` npm run server ``` to start NodeJS Socket.io server.

This tutorial will show you the power of livepeer and how you as a web developer might be able to leverage the platform to enhance the decentralized streaming ecosystem.  

Topics Covered:
- React
- Livepeer.js
- Node
- Websockets
- AWS EC2
- Metamask
- Ethereum
- Ethereum Rinkeby
- Video Streaming using OBS
- RTMP Protocol
- HLS.JS
- The Livepeer Player
- HTTP Live Streaming (HLS) and the m3u8 format

To wrap your head around how Livepeer fits into the video streaming ecosystem let's first take a look at a video streaming diagram and consider all the pieces of the stack required to stream/play a video.

Insert diagram here


As you can see, we need something to capture the video and send it to the Livepeer network/a livepeer node.  The Livepeer node consists of the [Livepeer Media Server] (https://github.com/livepeer/wiki/wiki/Livepeer-Media-Server) and Ethereum code which connects to a network of Livepeer nodes who will transcode the stream.

If we'd like our stream to be accessible to anyone on the public internet, we'll need to run a server that has a publicly accessible IP address like an AWS EC2 instance.  Otherwise, most computers sit on a local network that is not reachable by people not connected to the same router.  If you're at a hackathon you can bind the node to port 0.0.0.0 rather than localhost so other people on the same network can reach your stream.  

insert explanation of the rtmp Protocol

The simplest way to understand all of this is to [create the simplest webpage that can play a livepeer stream](https://github.com/blake41/livepeer-simple-video-player).  

Before we create the client code, let's set up a stream.  
[Follow the guides to set up a node and broadcast](https://github.com/livepeer/wiki/wiki/Blueprint:-set-up-a-broadcasting-node-using-Livepeer-and-OBS)
You should see your stream id in the console log in the Livepeer node terminal window, but you can always curl the server ```curl http://localhost:8935/manifestID``` to get the streamId.  Note (on my terminal) it prints out with a percent sign on the end, DO NOT include that in your stream id. For example, one my terminal I see 1220b0336cf5c3c34c0a05e5f8d9a6fb8874a091ff47a9546cf748d8e93827b00501a2cc4ea49099d7164a5676a04320c18c4048ea41d7b0fb2c5f0e94a81a8c97ef%, but my streamId = 1220b0336cf5c3c34c0a05e5f8d9a6fb8874a091ff47a9546cf748d8e93827b00501a2cc4ea49099d7164a5676a04320c18c4048ea41d7b0fb2c5f0e94a81a8c97ef

We can use the Livepeer player but to understand what's happening, let's build our own.  Currently most browsers don't support HLS in a standard HTML5 video tag, so we'll need to use a library to help us play the stream.  For that we'll use [HLS.js](https://github.com/video-dev/hls.js/).  [Google Chrome no longer allows videos to autoplay](https://developers.google.com/web/updates/2017/09/autoplay-policy-changes) so we'll need to add a button to manually allow the stream to start.  
On our html page, we'll load the hls Javascript file, our local javascript file we're calling hlsplayer.js, our css and we'll have a div that contains our video element.  

In our Javascript, we need to do a few things:
- hard code our streamID (which can be found by running ```curl http://localhost:8935/manifestID``` which will request the streamId from the livepeer node)
- Set our source to be 'http://localhost:8935/stream/' + streamId + '.m3u8'
- Create a new instance of HLS,
  - load the source
  - attach the player to the video element
- Lastly, let's create a function that runs onLoad which attaches a click handler which runs the HLS play function

If you have your livepeer node running, and a stream coming from obs, you should be able to click the play button and see your stream!  

Let's break down what's going on here.  
insert explanation of how livepeer works (the decentralized video transcoding part)

We could also have used the livepeer.js video player to play the video, which is a wrapper around HLS.js

Now that we know how to play video using livepeer, let's build a client experience that's a bit richer than currently exists.  Imagine you're streaming video where a presenter is communicating with an in person audience as well as an online audience.  It would be great if the presenter could take questions/interact with the folks online.  Let's add a chatroom into the client app next to the live video stream.  Since we're already in the Ethereum ecosystem, it would also be great to allow consumers of the stream to tip the broadcaster natively in ETH.  Lastly, we'd like to use the Livepeer SDK to estimate how much it's costing us to stream our video content.  

Since we're not focused on building a chat app, let's use an open source websocket powered chatroom and add livepeer to it.  I'm going to use something built with create react app that we can use as the scaffolding of our project and uses socket.io as the API to our websocket server.  [Here's a good starting point](https://github.com/vlw0052/Tutorial---ReactJS-and-Socket.io-Chat-App).

Once we have our react app, let's `npm install` to install our dependencies and work on adding livepeer.

Layout.js is our main insertion point for our react app.  Let's add another component to it that will render our Livepeer video feed.  

```jsx
render() {
  const { title } = this.props
  const { socket, user } = this.state
  return (
    <div className='body-container'>
      <VideoContainer streamId={'myManifestId'}/>
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
```  

We'll pass in a streamId that we can hardcode for now just to get it working that we'll later replace with a dynamic prop pulled from a url param.
