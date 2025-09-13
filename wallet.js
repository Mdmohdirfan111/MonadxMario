// ===================================================================================
// WALLET.JS - Poora naya code VIEM library ke saath
// ===================================================================================
import { createWalletClient, http, custom, createPublicClient, parseGwei } from 'https://esm.sh/viem';

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
const contractAddress = "0x14896CE011F043ca147a283f33980AdA9C43A2f5";
const contractABI = [{"inputs":[{"internalType":"uint256","name":"stage","type":"uint256"}],"name":"mintReward","outputs":[],"stateMutability":"nonpayable","type":"function"}]; // Sirf zaroori function rakha hai

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

    // Viem ke clients banana
    walletState.walletClient = createWalletClient({
        chain: monadTestnet,
        transport: custom(window.ethereum)
    });
    walletState.publicClient = createPublicClient({
        chain: monadTestnet,
        transport: http()
    });

    try {
        // Step 1: User se address maangna
        const [address] = await walletState.walletClient.requestAddresses();
        walletState.userAddress = address;

        // Step 2: Network check karna
        const chainId = await walletState.walletClient.getChainId();
        if (chainId !== monadTestnet.id) {
            try {
                await walletState.walletClient.switchChain({ id: monadTestnet.id });
            } catch (switchError) {
                 // Agar network wallet mein add nahi hai toh add karne ki koshish karna
                console.error("Could not switch chain, attempting to add...", switchError);
                // Note: Viem abhi tak addEthereumChain ka direct support nahi deta,
                // lekin switchChain request se MetaMask khud hi add karne ka prompt de deta hai.
                showMessage("Please Switch/Add Monad Testnet in MetaMask", "Close", () => document.getElementById('message-box').style.display = 'none');
                return false;
            }
        }
        
        console.log("Wallet Connected with Viem:", walletState.userAddress);
        return true; // Success

    } catch (error) {
        console.error("Wallet connection failed:", error);
        showMessage("Wallet Connection Failed", "Close", () => document.getElementById('message-box').style.display = 'none');
        return false; // Failure
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
        
        // Transaction ke complete hone ka wait karna
        const receipt = await walletState.publicClient.waitForTransactionReceipt({ hash: txHash });
        console.log(`NFT for Stage ${stage} minted successfully!`, receipt);
        return true; // Success

    } catch (error) {
        console.error("NFT Minting failed:", error);
        alert("NFT Minting failed. Check console for details.");
        return false; // Failure
    }
}
