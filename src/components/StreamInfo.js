import LivepeerSDK from '@livepeer/sdk'
import React, { Component } from 'react';
import config from 'react-global-configuration';

class StreamInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {pricePerSegment: 'unknown', secondsElapsed: 0}
    this.totalBroadcastPrice = this.totalBroadcastPrice.bind(this);
  }

  componentDidMount() {
    var self = this;
    LivepeerSDK({ provider: config.get('provider'), controllerAddress: config.get('controllerAddress') }).then(async sdk => {
      const { rpc } = sdk
      const jobs = await rpc.getJobs({ broadcaster: config.get('ETHAddress')})
      const job = jobs.filter(job => job.streamId.substring(0,132) == this.props.streamId)
      var pricePerSegment = "can't find job";
      if (jobs.length > 0) {
        const jobObject = await rpc.getJob(job[0].id);
        const transcoder = await rpc.getTranscoder(jobObject.transcoder);
        pricePerSegment = transcoder.pricePerSegment;
      }
      self.setState({pricePerSegment: pricePerSegment})
    })
    setInterval(function(){ self.setState({secondsElapsed: self.state.secondsElapsed + 1}) }, 1000);
  }

  totalBroadcastPrice() {
    if (this.state.pricePerSegment == "can't find job" || this.state.pricePerSegment == 'unknown') {
      return "can't find job"
    }
    return this.state.pricePerSegment * this.state.secondsElapsed
  }

  render() {
    return (
      <div className='stream-info-container default-font default-font-color'>
        <div>{`The price for each 4 second segment is: ${this.state.pricePerSegment}`}</div>
        <div>{`The cost to transcode this broadcast since you've been connected is: ${this.totalBroadcastPrice()}`}</div>
      </div>
    );
  }
}

export default StreamInfo
