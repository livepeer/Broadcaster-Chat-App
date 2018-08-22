import React, { Component } from 'react';
import ReactHLS from 'react-hls';
import axios from 'axios'
import TipContainer from './TipContainer'
// import 'react-hls/src/style.css'; // need to import basic styles
// import 'react-hls/src/icons.css'; // need to import basic icons
import config from 'react-global-configuration';
import StreamInfo from './StreamInfo'
class VideoContainer extends Component {
	constructor(props) {
	  super(props);
		this.state = {}
	}

	source() {
		var source = 'http://' + config.get('serverIp') + ':8935/stream/' + this.props.streamId + '.m3u8'
		return source
	}

  render() {
    return(
			<div className='left-container'>
				<div className="video-container">
					<div>
						<div>
							<ReactHLS url={this.source()} />
						</div>
					</div>
				</div>
				<TipContainer />
				<StreamInfo streamId={this.props.streamId}/>
			</div>
    )
  }

}

export default VideoContainer
