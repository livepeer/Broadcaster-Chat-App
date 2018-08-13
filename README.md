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

The simplest way to understand all of this is to create the simplest webpage that can play a livepeer stream.  
