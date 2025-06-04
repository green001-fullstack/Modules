// import './style.css'
// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.js'

// document.querySelector('#app').innerHTML = `
//   <div>
//     <a href="https://vite.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//       <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//     </a>
//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector('#counter'))



import { ethers } from 'ethers'

// Global variables
let provider
let signer
let userAddress

// DOM elements
const connectButton = document.getElementById('connectButton')
const walletInfo = document.getElementById('walletInfo')
const walletAddress = document.getElementById('walletAddress')
const walletBalance = document.getElementById('walletBalance')
const networkInfo = document.getElementById('networkInfo')
const recipient = document.getElementById('recipient')
const amount = document.getElementById('amount')
const sendButton = document.getElementById('sendButton')
const statusDiv = document.getElementById('status')







// get the app started
async function getStarted() {

  // Check if Ethereum provider is available i.e Metamask else request the installation

  if (window.ethereum) {
    // Connects Ethers.js to the web3 provider --> MetaMask (or other wallets)
    provider = new ethers.providers.Web3Provider(window.ethereum)

    // on clicking connect button, connect to wallet
    connectButton.addEventListener('click', connectWallet)

  

    // Get the current chain ID from the Ethereum provider
    const chainId = await window.ethereum.request({ method: 'eth_chainId' })

    // Set up listener for when the chain changes (user switches networks)
    window.ethereum.on('chainChanged', handleChainChanged)

    // Function to handle when the chain changes
    function handleChainChanged(chainId) {
      window.location.reload()
    }
  } else {
    statusDiv.textContent =
      'Please install MetaMask or another Ethereum wallet provider.'
    statusDiv.className = 'error'
    connectButton.disabled = true
  }
}

// Connect wallet function
async function connectWallet() {
  try {
    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' })

    // Get signer
    signer = provider.getSigner()
    userAddress = await signer.getAddress()

    updateUI()
  } catch (error) {
    console.error('Error connecting wallet:', error)
    statusDiv.textContent = 'Error connecting wallet: ' + error.message
    statusDiv.className = 'error'
  }
}






// Update UI with wallet info
async function updateUI() {
  try {
    // Update address
    walletAddress.textContent = userAddress

    // Update balance
    const balance = await provider.getBalance(userAddress)
    walletBalance.textContent = ethers.utils.formatEther(balance) + ' ETH'

    // Show wallet info
    walletInfo.style.display = 'block'
    connectButton.textContent = 'Connected'
    connectButton.disabled = true

    // Clear status
    statusDiv.textContent = ''
    statusDiv.className = ''
  } catch (error) {
    console.error('Error updating UI:', error)
    statusDiv.textContent = 'Error updating wallet info' 
    statusDiv.className = 'error'
  }
}





// Send ETH function
async function sendETH() {
  const recipientAddress = recipient.value.trim()
  const ethAmount = amount.value.trim() 
  const balance = await provider.getBalance(userAddress)
  const ETHbalance = ethers.utils.formatEther(balance) 
  


  // Validate inputs
  if (!ethers.utils.isAddress(recipientAddress)) {
    statusDiv.textContent = 'Invalid recipient address'
    statusDiv.className = 'error'
    return
  }

  if (isNaN(ethAmount) || parseFloat(ethAmount) <= 0) {
    statusDiv.textContent = 'Invalid amount'
    statusDiv.className = 'error'
    return
  }

 
  if (parseFloat(ethAmount) > parseFloat(ETHbalance)) {
    statusDiv.textContent = 'Insufficient Ether balance to complete transaction'
    statusDiv.className = 'error'
    return
  }

  try {
    // processing
    sendButton.disabled = true
    statusDiv.textContent = 'Sending transaction...'
    statusDiv.className = ''

    // Convert ETH amount to wei(smallest unit of eth)
    const amountWei = ethers.utils.parseEther(ethAmount)

    // Send transaction
    const tx = await signer.sendTransaction({
      to: recipientAddress,
      value: amountWei,
    })
    console.log(tx)

    statusDiv.textContent ='Transaction sent! Hash'
    statusDiv.className = 'success'

    // Update balance after transaction
    updateUI()
  } catch (error) {
    console.error('Error sending transaction:', error)
    statusDiv.textContent =
      'Error sending transaction'
    statusDiv.className = 'error'
  } finally {
    sendButton.disabled = false
  }
}

// Event listeners

sendButton.addEventListener('click', sendETH)

// Initialize the app
window.addEventListener('load', getStarted)
