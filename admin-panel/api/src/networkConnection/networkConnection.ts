import { Contract, Gateway, Wallets } from "fabric-network";
import FabricCAServices from "fabric-ca-client";
import path from "path";
import {
  buildCAClient,
  registerAndEnrollUser,
  enrollAdmin,
} from "../tools/caUtil";
import { buildCCPOrg1, buildWallet } from "../tools/appUtil";

const channelName = "votingchannel";
const voterPermitCC = "voterpermitcc";

const electionCommissionOrg = "ElectionCommissionMSP";
const machine1UserId = "machine1";

async function initGatewayForElectionCommissionOrg() {
  console.log(
    "\n--> Fabric client user & Gateway init: Using ElectionCommissionOrg identity to ElectionCommissionOrg Peer"
  );
  // build an in memory object with the network configuration (also known as a connection profile)
  const ccpElectionCommissionOrg = buildCCPOrg1();

  // build an instance of the fabric ca services client based on
  // the information in the network configuration
  const caElectionCommissionClient = buildCAClient(
    FabricCAServices,
    ccpElectionCommissionOrg,
    "ca.electioncommission.example.com"
  );

  // setup the wallet to cache the credentials of the application user, on the app server locally
  const walletPathElectionCommission = path.join(__dirname, "wallet", "electioncommission");
  const walletElectionCommission = await buildWallet(Wallets, walletPathElectionCommission);

  // in a real application this would be done on an administrative flow, and only once
  // stores admin identity in local wallet, if needed
  await enrollAdmin(caElectionCommissionClient, walletElectionCommission, electionCommissionOrg);
  // register & enroll application user with CA, which is used as client identify to make chaincode calls
  // and stores app user identity in local wallet
  // In a real application this would be done only when a new user was required to be added
  // and would be part of an administrative flow
  await registerAndEnrollUser(
    caElectionCommissionClient,
    walletElectionCommission,
    electionCommissionOrg,
    machine1UserId,
    "electioncommission.department1"
  );

  try {
    // Create a new gateway for connecting to Org's peer node.
    const gatewayElectionCommission = new Gateway();
    //connect using Discovery enabled
    await gatewayElectionCommission.connect(ccpElectionCommissionOrg, {
      wallet: walletElectionCommission,
      identity: machine1UserId,
      discovery: { enabled: true, asLocalhost: true },
    });

    return gatewayElectionCommission;
  } catch (error) {
    console.error(`Error in connecting to gateway for ElectionCommissionOrg: ${error}`);
    process.exit(1);
  }
}

function checkAsset(
  org: string,
  assetKey: any,
  resultBuffer: Buffer<ArrayBufferLike>,
  value: number,
  ownerOrg: any
) {
  let asset;
  if (resultBuffer) {
    asset = JSON.parse(resultBuffer.toString("utf8"));
  }

  if (asset && value) {
    if (asset.Value === value && asset.OwnerOrg === ownerOrg) {
      console.log(
        `*** Result from ${org} - asset ${asset.ID} has value of ${asset.Value} and owned by ${asset.OwnerOrg}`
      );
    } else {
      console.log(
        `*** Failed from ${org} - asset ${asset.ID} has value of ${asset.Value} and owned by ${asset.OwnerOrg}`
      );
    }
  } else if (!asset && value === 0) {
    console.log(`*** Success from ${org} - asset ${assetKey} does not exist`);
  } else {
    console.log("*** Failed - asset read failed");
  }
}

async function readAssetByOrganization(
  assetKey: string,
  value: number,
  ownerOrg: string,
  contractOrg1: Contract
) {
  if (value) {
    console.log(
      `\n--> Evaluate Transaction: ReadAsset, - ${assetKey} should have a value of ${value} and owned by ${ownerOrg}`
    );
  } else {
    console.log(
      `\n--> Evaluate Transaction: ReadAsset, - ${assetKey} should not exist`
    );
  }
  let resultBuffer = await contractOrg1.evaluateTransaction("ReadAsset", assetKey);
  checkAsset("Org1", assetKey, resultBuffer, value, ownerOrg);
}

// This application uses fabric-samples/test-network based setup and the companion chaincode
// For this illustration, both Org1 & Org2 client identities will be used, however
// notice they are used by two different "gateway"s to simulate two different running
// applications from two different organizations.
async function main() {
  try {
    // use a random key so that we can run multiple times
    const assetKey = `asset-${Math.floor(Math.random() * 100) + 1}`;

    /** ******* Fabric client init: Using Org1 identity to Org1 Peer ******* */
    const gatewayElectionCommission = await initGatewayForElectionCommissionOrg();
    const networkElectionCommission = await gatewayElectionCommission.getNetwork(channelName);
    const contractElectionCommission = networkElectionCommission.getContract(voterPermitCC);

    try {
      let transaction;

      try {
        // Create an asset by organization Org1, this will require that both organization endorse.
        // The endorsement will be handled by Discovery, since the gateway was connected with discovery enabled.
        console.log(
          `\n--> Submit Transaction: CreateAsset, ${assetKey} as Org1 - endorsed by Org1 and Org2`
        );
        await contractOrg1.submitTransaction(
          "CreateAsset",
          assetKey,
          "100",
          "Tom"
        );
        console.log(
          "*** Result: committed, now asset will only require Org1 to endorse"
        );
      } catch (createError) {
        console.log(`*** Failed: create - ${createError}`);
        process.exit(1);
      }

      await readAssetByOrganization(assetKey, 100, org1, contractOrg1);
    } catch (runError) {
      console.error(`Error in transaction: ${runError}`);
      process.exit(1);
    } finally {
      // Disconnect from the gateway peer when all work for this client identity is complete
      gatewayOrg1.disconnect();
    }
  } catch (error) {
    console.error(`Error in setup: ${error}`);
    process.exit(1);
  }
}

main();
