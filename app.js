let web3;
let contract;
let accounts;

// Function to initialize web3
async function initWeb3() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
    }
    else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
    web3 = window.web3;
}

// Function to initialize contract
async function initContract() {
    const contractAddress = '0xD57B0BfC18Ce36695676b661416a305e304bd97c';
    const contractABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amountToken",
				"type": "uint256"
			}
		],
		"name": "addLiquidity",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract IERC20",
				"name": "_token",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amountETH",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amountToken",
				"type": "uint256"
			}
		],
		"name": "LiquidityAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amountETH",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amountToken",
				"type": "uint256"
			}
		],
		"name": "LiquidityRemoved",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "liquidity",
				"type": "uint256"
			}
		],
		"name": "removeLiquidity",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amountIn",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "maxSlippagePercentage",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "deadline",
				"type": "uint256"
			}
		],
		"name": "swap",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amountIn",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amountOut",
				"type": "uint256"
			}
		],
		"name": "Swapped",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "getReserves",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "liquidityBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "MAX_SLIPPAGE_PERCENTAGE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "reserveETH",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "reserveToken",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "token",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalLiquidity",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
    contract = new web3.eth.Contract(contractABI, contractAddress);
}

// Function to initialize account
async function initAccount() {
    accounts = await web3.eth.getAccounts();
}

// Function to initialize app
async function initApp() {
    await initWeb3();
    await initContract();
    await initAccount();
    await updateUI();
}

window.addEventListener('load', initApp);

async function addLiquidity() {
    const amountToken = document.getElementById('addLiquidityAmount').value;
    const amountETH = web3.utils.toWei(document.getElementById('addLiquidityETH').value, 'ether');
    if (amountToken <= 0 || amountETH <= 0) {
        window.alert('Please enter a valid amount.');
        return;
    }
    try {
        await contract.methods.addLiquidity(amountToken).send({ from: accounts[0], value: amountETH });
        await updateUI();
    } catch (error) {
        console.error('An error occurred: ', error);
        window.alert('An error occurred. Please check the console for more details.');
    }
}

async function removeLiquidity() {
    const liquidity = document.getElementById('removeLiquidity').value;
    if (liquidity <= 0) {
        window.alert('Please enter a valid amount.');
        return;
    }
    try {
        await contract.methods.removeLiquidity(liquidity).send({ from: accounts[0] });
        await updateUI();
    } catch (error) {
        console.error('An error occurred: ', error);
        window.alert('An error occurred. Please check the console for more details.');
    }
}

async function swap() {
    const amountIn = document.getElementById('swapAmountIn').value;
    const maxSlippage = document.getElementById('swapMaxSlippage').value;
    const deadline = document.getElementById('swapDeadline').value;
    const amountETH = web3.utils.toWei(document.getElementById('swapETH').value, 'ether');
    if (amountIn <= 0 || maxSlippage < 0 || maxSlippage > 100 || deadline <= Date.now() || amountETH <= 0) {
        window.alert('Please enter valid values.');
        return;
    }
    try {
        await contract.methods.swap(amountIn, maxSlippage, deadline).send({ from: accounts[0], value: amountETH });
        await updateUI();
    } catch (error) {
        console.error('An error occurred: ', error);
        window.alert('An error occurred. Please check the console for more details.');
    }
}

async function updateUI() {
    // update UI with the latest contract and account info
}
