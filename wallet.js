// ===================================================================================
// WALLET.JS - Poora naya code VIEM library ke saath
// ===================================================================================
import { createWalletClient, http, custom, createPublicClient } from 'https://esm.sh/viem';

// --- Monad Testnet ki jaankari ---
const monadTestnet = {
    id: 10143,
    name: 'Monad Testnet',
    network: 'monad-testnet',
    nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
    rpcUrls: {
        default: { http: ['https://testnet-rpc.monad.xyz'] },
        public: { http: ['https://testnet-rpc.monad.xyz'] },
    },
    blockExplorers: {
        default: { name: 'Monad Explorer', url: 'https://testnet.monadexplorer.com' },
    },
};

// --- Contract ki saari jaankari yahan hai ---
const contractAddress = "0xC8aB85A205cC3B9Bc0d7Af7532e4b9Ea0f06d79d";
const contractABI = [{"inputs":[{"internalType":"address","name":"initialOwner","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"TOTAL_STAGES","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"stage","type":"uint256"}],"name":"mintReward","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"s" : "nonpayable", "type" : "function"}];

// Yeh object wallet ki state ko store karega
export const walletState = {
    walletClient: null,
    publicClient: null,
    userAddress: null
};

// Wallet connect karne ka function
export async function connectWallet(showMessage) {
    if (typeof window.ethereum === 'undefined') {
        showMessage("MetaMask Not Found", "Close", () => document.getElementById('message-box').style.display = 'none');
        return false;
    }

    walletState.walletClient = createWalletClient({
        chain: monadTestnet,
        transport: custom(window.ethereum)
    });
    walletState.publicClient = createPublicClient({
        chain: monadTestnet,
        transport: http()
    });

    try {
        const [address] = await walletState.walletClient.requestAddresses();
        walletState.userAddress = address;

        const chainId = await walletState.walletClient.getChainId();
        if (chainId !== monadTestnet.id) {
            try {
                await walletState.walletClient.switchChain({ id: monadTestnet.id });
            } catch (switchError) {
                showMessage("Please Switch/Add Monad Testnet in MetaMask", "Close", () => document.getElementById('message-box').style.display = 'none');
                return false;
            }
        }
        
        console.log("Wallet Connected with Viem:", walletState.userAddress);
        return true; 

    } catch (error) {
        console.error("Wallet connection failed:", error);
        showMessage("Wallet Connection Failed", "Close", () => document.getElementById('message-box').style.display = 'none');
        return false; 
    }
}

// NFT Mint karne ka function
export async function mintNFTReward(stage) {
    if (!walletState.walletClient || !walletState.userAddress) {
        console.error("Wallet not connected.");
        alert("Wallet not connected. Please connect wallet again.");
        return false;
    }
    try {
        const { request } = await walletState.publicClient.simulateContract({
            address: contractAddress,
            abi: contractABI,
            functionName: 'mintReward',
            args: [stage],
            account: walletState.userAddress
        });

        const txHash = await walletState.walletClient.writeContract(request);
        console.log(`Transaction sent: ${txHash}`);
        
        const receipt = await walletState.publicClient.waitForTransactionReceipt({ hash: txHash });
        console.log(`NFT for Stage ${stage} minted successfully!`, receipt);
        return true; 

    } catch (error) {
        console.error("NFT Minting failed:", error);
        alert("NFT Minting failed. Check console for details.");
        return false; 
    }
}

// Naya function wallet disconnect karne ke liye
export function disconnectWallet() {
    console.log("Disconnecting wallet from app state.");
    walletState.walletClient = null;
    walletState.publicClient = null;
    walletState.userAddress = null;
}

