import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.esm.js";

// ===================================================================================
// WALLET.JS - Sirf Wallet aur Blockchain ka Logic (Updated)
// ===================================================================================

// --- Monad Testnet Details ---
const monadTestnet = {
    chainId: '0x279f', // 10143 in hexadecimal
    chainName: 'Monad Testnet',
    nativeCurrency: {
        name: 'MON',
        symbol: 'MON',
        decimals: 18,
    },
    rpcUrls: ['https://testnet-rpc.monad.xyz'],
    blockExplorerUrls: ['https://testnet.monadexplorer.com'],
};

// --- Contract ki saari jaankari yahan hai ---
const contractAddress = "0x14896CE011F043ca147a283f33980AdA9C43A2f5";
const contractABI = [{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"initialOwner","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"address","name":"owner","type":"address"}],"name":"ERC721IncorrectOwner","type":"error"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ERC721InsufficientApproval","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC721InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"operator","type":"address"}],"name":"ERC721InvalidOperator","type":"error"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"ERC721InvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC721InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC721InvalidSender","type":"error"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ERC721NonexistentToken","type":"error"},{"inputs":[{"internalType":"uint256","name":"stage","type":"uint256"}],"name":"mintReward","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":""}],"name":"playerStageProgress","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TOTAL_STAGES","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];

// Yeh object wallet ki state ko store karega
export const walletState = {
    contract: null,
    userAddress: null
};

// Network switch karne ka helper function
async function switchNetwork(provider) {
    try {
        await provider.send('wallet_switchEthereumChain', [{ chainId: monadTestnet.chainId }]);
    } catch (switchError) {
        // Error code 4902 ka matlab hai ki chain MetaMask mein add nahi hai
        if (switchError.code === 4902) {
            try {
                await provider.send('wallet_addEthereumChain', [monadTestnet]);
            } catch (addError) {
                console.error("Failed to add Monad Testnet", addError);
                throw new Error("Could not add Monad Testnet to your wallet.");
            }
        } else {
            console.error("Failed to switch network", switchError);
            throw new Error("Could not switch to Monad Testnet.");
        }
    }
}

// Wallet connect karne ka function
export async function connectWallet(showMessage) {
    if (typeof window.ethereum === 'undefined') {
        showMessage("MetaMask Not Found", "Close", () => document.getElementById('message-box').style.display = 'none');
        return false;
    }
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        
        // Step 1: Network check karna
        const network = await provider.getNetwork();
        if (network.chainId !== parseInt(monadTestnet.chainId, 16)) {
             alert("Wrong network detected. Please switch to Monad Testnet.");
            await switchNetwork(provider);
        }
        
        // Accounts request karna
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        walletState.userAddress = await signer.getAddress();
        walletState.contract = new ethers.Contract(contractAddress, contractABI, signer);

        console.log("Wallet Connected and Contract Initialized:", walletState.userAddress);
        return true; // Success
    } catch (error) {
        console.error("Wallet connection failed:", error);
        showMessage("Connection Failed", "Close", () => document.getElementById('message-box').style.display = 'none');
        return false; // Failure
    }
}

// NFT Mint karne ka function
export async function mintNFTReward(stage) {
    if (!walletState.contract) {
        console.error("Contract not initialized.");
        alert("Contract not initialized. Please connect wallet again.");
        return false;
    }
    try {
        const tx = await walletState.contract.mintReward(stage);
        console.log("Minting transaction sent:", tx.hash);
        await tx.wait();
        console.log(`NFT for Stage ${stage} minted successfully!`);
        return true; // Success
    } catch (error) {
        console.error("NFT Minting failed:", error);
        // Error se user-friendly message nikalna
        const reason = error.reason || "Please check the console for details.";
        alert(`NFT Minting failed: ${reason}`);
        return false; // Failure
    }
}