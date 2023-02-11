import { BrowserWallet, ForgeScript, Transaction } from "@meshsdk/core";
import { useState } from "react";
import Image from "next/image";
import image from "../assets/ape.jpg";

export default function Home() {
  const [transactionHash, setTransactionHash] = useState("");

  const mintAsset = async () => {
    const walletInstalled = !!window?.cardano?.nami;
    if (!walletInstalled) {
      alert("Please Install Nami Wallet");
      return;
    }

    const walletApi = await BrowserWallet.enable("nami");
    const usedAddress = await walletApi.getUsedAddresses();
    const address = usedAddress[0];
    const forgingScript = ForgeScript.withOneSignature(address);

    const tx = new Transaction({ initiator: walletApi });

    const assetMetadata = {
      name: "Name of NFT",
      image: "ipfs://QmRzicpReutwCkM6aotuKjErFCUD213DpwPq6ByuzMJaua",
      mediaType: "image/jpg",
      description: "This NFT is minted by Mesh (https://meshjs.dev/).",
    };

    const asset1 = {
      assetName: "Token Name 123",
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
    setTransactionHash(txHash);
  };

  return (
    <div
      className="flex h-screen w-screen"
      style={{
        backgroundImage: `url(${image.src})`,
      }}
    >
      <div class="m-auto">
        <div className="w-[500px] h-[500px] bg-gray-900 p-5 rounded border-double">
          <div className="flex justify-between">
            <div>
              <label class="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Name of NFT
              </label>
              <input
                type="text"
                className="text-sm rounded-lg block bg-gray-700 border-gray-600 text-white p-2 mb-5"
              />
            </div>
            <div>
              <label class="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Amount Asset to mint
              </label>
              <input
                type="number"
                className="text-sm rounded-lg block bg-gray-700 border-gray-600 text-white p-2 mb-5"
              />
            </div>
          </div>
          <label
            for="small-input"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            IPFS Image Link
          </label>
          <input
            type="text"
            id="small-input"
            className="text-sm rounded-lg block bg-gray-700 border-gray-600 text-white p-2 mb-5 w-full"
          />
          <label
            for="small-input"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Wallet Address of recipient
          </label>
          <input
            type="text"
            id="small-input"
            className="text-sm rounded-lg block bg-gray-700 border-gray-600 text-white p-2 mb-5 w-full"
          />
          <div className="flex justify-end">
            <button onClick={mintAsset}>Mint NFT</button>
          </div>
        </div>
      </div>
    </div>
  );
}
