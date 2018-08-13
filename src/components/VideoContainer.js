import React, { Component } from 'react';
import ReactHLS from 'react-hls';
import axios from 'axios'
import TipContainer from './TipContainer'
// import 'react-hls/src/style.css'; // need to import basic styles
// import 'react-hls/src/icons.css'; // need to import basic icons
class VideoContainer extends Component {
	constructor(props) {
	  super(props);
		this.state = {}
	}

	componentDidMount() {
		// axios.get('http://localhost:8935/manifestID')
		// .then(function(response) {
		// 	debugger
		// 	this.setState({streamId: response.body.data})
		// })
	}

	source() {
		var source = 'http://35.170.68.143:8935/stream/' + this.state.streamId + '.m3u8'
		return source
	}

  render() {
    return(
			<div className='left-container'>
				<div className="video-container">
					<input value={this.state.streamId} className='streamId' onChange={(event) => {this.setState({streamId: event.target.value})}}></input>
					<div>
						<div>
							{this.state.streamId && <ReactHLS url={this.source()} />}
						</div>
					</div>
				</div>
				<TipContainer />
			</div>
    )
  }

}

export default VideoContainer
