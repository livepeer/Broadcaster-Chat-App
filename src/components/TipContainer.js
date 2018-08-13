import React, { Component } from 'react';
import Web3 from 'web3'
class TipContainer extends Component {
	constructor(props) {
	  super(props);
	}

  handleClick() {
    if (typeof Web3 === 'undefined') {
      return console.log('You need to install MetaMask to use this feature.  https://metamask.io')
    }
		var localWeb3 = new Web3(window.web3.currentProvider)
		const getAccount = async () => {
	  	const accounts = await localWeb3.eth.getAccounts();
			return accounts[0]
		};
		const sendEth = async () => {
			var user_address = await getAccount()
	    localWeb3.eth.sendTransaction({
	      to: '0xf17f52151ebef6c7334fad080c5704d77216b732',
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
