import LivepeerSDK from '@livepeer/sdk'
import React, { Component } from 'react';

class StreamInfo extends Component {
	constructor(props) {
	  super(props);
	}

  componentDidMount() {
    LivepeerSDK({}).then(async (sdk) => {

      // Once initialized, you can access the methods under the `rpc` namespace
      const { rpc } = sdk

      // For example, you can get the total supply of Livepeer Tokens like so
      const jobs = await rpc.getJobs({broadcaster: '0xa452a1824ac4609Ab93d8b8a442b04847a6Aee01'})

      console.log(jobs[0])
    })
  }

	render() {
		return (
    	<div></div>
		);
	}
}

export default StreamInfo
