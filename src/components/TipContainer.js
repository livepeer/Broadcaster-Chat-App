import React, { Component } from 'react';
import Web3 from 'web3'
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
