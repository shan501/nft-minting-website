import { BrowserWallet, ForgeScript, Transaction } from "@meshsdk/core";
import { useState } from "react";

export default function Home() {
  const [walletApi, setWalletApi] = useState({});
  const [walletConnected, setWalletConnected] = useState(false);
  const [balance, setBalance] = useState(0);

  const connectToWallet = async () => {
    const walletInstalled = !!window?.cardano?.nami;
    if (!walletInstalled) {
      alert("Please Install Nami Wallet");
      return;
    } else {
      const wallet = await BrowserWallet.enable("nami");
      setWalletConnected(true);
      setWalletApi(wallet);
    }
  };

  const disconnectWallet = async () => {
    setWalletConnected(false);
    setWalletApi({});
    setBalance(0);
  };

  const mintAsset = async () => {
    const usedAddress = await walletApi.getUsedAddresses();
    const address = usedAddress[0];
    const forgingScript = ForgeScript.withOneSignature(address);

    const tx = new Transaction({ initiator: walletApi });

    // define asset#1 metadata
    const assetMetadata = {
      name: "Name of NFT",
      image: "ipfs://QmRzicpReutwCkM6aotuKjErFCUD213DpwPq6ByuzMJaua",
      mediaType: "image/jpg",
      description: "This NFT is minted by Mesh (https://meshjs.dev/).",
    };

    const asset1 = {
      assetName: "MeshToken",
      assetQuantity: "1",
      metadata: assetMetadata,
      label: "721",
      recipient:
        "addr_test1qp3q7xj0t56zkprcrazca9lknghrmtjk8vgz0nldrec67gln8df7mlcw5kv8ay6vpewqalu8ktqmtt5696mp4nt4js0qk3y9zw",
    };
    tx.mintAsset(forgingScript, asset1);
    const unsignedTx = await tx.build();
    const signedTx = await walletApi.signTx(unsignedTx);
    const txHash = await walletApi.submitTx(signedTx);
  };

  return (
    <div className="min-h-screen">
      <div className="flex justify-end">
        {walletConnected ? (
          <button
            className="bg-gray-900 text-slate-300 py-2 px-4 rounded m-5 w-[200px]"
            onClick={disconnectWallet}
          >
            Disconnect Wallet
          </button>
        ) : (
          <button
            className="bg-gray-900 text-slate-300 py-2 px-4 rounded m-5 w-[200px]"
            onClick={connectToWallet}
          >
            Connect Wallet
          </button>
        )}
      </div>
      <div className="flex justify-center">
        <div className="w-[300px] h-[300px] bg-gray-900">
          <label
            for="small-input"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Name of NFT
          </label>
          <input type="text" id="small-input" />
          <label
            for="small-input"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            IPFS Image Link
          </label>
          <input type="text" id="small-input" />
          <label
            for="small-input"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Amount Asset to mint
          </label>
          <input type="text" id="small-input" />
          <label
            for="small-input"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Wallet Address of recipient
          </label>
          <input type="text" id="small-input" />
          <div className="flex justify-end">
            <button onClick={mintAsset}>Mint NFT</button>
          </div>
        </div>
      </div>
    </div>
  );
}
