import { Contract, Gateway, Wallet, Wallets } from "fabric-network";
import FabricCAServices from "fabric-ca-client";
import path from "path";
import { buildCAClient, enrollAdmin, enrollNewAdmin, registerAndEnrollUser } from "../tools/caUtil";
import { buildCCPOrg, buildWallet } from "../tools/appUtil";

const channelName = "votingchannel";
const voterPermitCC = "voterpermitcc";
const voteTallyCC = "votetallycc";

const districtCommissionOrg = "DistrictCommissionMSP";
// const adminId = "admin";

// build an in memory object with the network configuration (also known as a connection profile)
const ccpDistrictCommissionOrg = buildCCPOrg();

// setup the wallet to cache the credentials of the application user, on the app server locally
const walletPathDistrictCommission = path.join(
  __dirname,
  "wallet",
  "districtcommission"
);

// build an instance of the fabric ca services client based on
// the information in the network configuration
const caDistrictCommissionClient = buildCAClient(
  FabricCAServices,
  ccpDistrictCommissionOrg,
  "ca.districtCommission.example.com"
);

// Create a new gateway for connecting to Org's peer node.
export const gatewayDistrictCommission = new Gateway();

export async function initiallyEnrollAdminAndConnectGateway(
  adminUserId: string,
  adminUserPassword: string
) {
  console.log(
    "\n--> Fabric client user & Gateway init: Using DistrictCommissionOrg identity to DistrictCommissionOrg Peer"
  );

  const walletDistrictCommission = await buildWallet(
    Wallets,
    walletPathDistrictCommission
  );

  // in a real application this would be done on an administrative flow, and only once
  // stores admin identity in local wallet, if needed
  await enrollAdmin(
    caDistrictCommissionClient,
    walletDistrictCommission,
    districtCommissionOrg,
    adminUserId,
    adminUserPassword
  );

  try {
    //connect using Discovery enabled
    await gatewayDistrictCommission.connect(ccpDistrictCommissionOrg, {
      wallet: walletDistrictCommission,
      identity: adminUserId,
      discovery: { enabled: true, asLocalhost: true },
    });
  } catch (error) {
    console.error(
      `Error in connecting to gateway for ElectionCommissionOrg: ${error}`
    );
    process.exit(1);
  }
}

export async function createNewAdmin(adminUserId: string, adminUserPassword: string, bootstrapAdminId: string) {
  const walletDistrictCommission = await buildWallet(
    Wallets,
    walletPathDistrictCommission
  );

  await enrollNewAdmin(
    caDistrictCommissionClient,
    walletDistrictCommission,
    districtCommissionOrg,
    adminUserId,
    adminUserPassword,
    bootstrapAdminId
  );
}

export async function createUser(userId: string, userPassword: string, adminUserId: string) {
  console.log("Register and enroll a new User:")
  const walletDistrictCommission = await buildWallet(
    Wallets,
    walletPathDistrictCommission
  );

  await registerAndEnrollUser(caDistrictCommissionClient, walletDistrictCommission, districtCommissionOrg, userId, userPassword, '', adminUserId)
}

export async function getVoterPermitContractAndGateway() {
  try {
    /** ******* Fabric client init: Using ElectionCommission identity to ElectionCommission Peer ******* */
    const networkDistrictCommission =
      await gatewayDistrictCommission.getNetwork(channelName);
    const contractElectionCC =
      networkDistrictCommission.getContract(voterPermitCC);

    return contractElectionCC;
  } catch (error) {
    console.error(`Error in setup: ${error}`);
    process.exit(1);
  }
}

export async function getVoteTallyContractAndGateway() {
  try {
    /** ******* Fabric client init: Using ElectionCommission identity to ElectionCommission Peer ******* */
    const networkDistrictCommission =
      await gatewayDistrictCommission.getNetwork(channelName);
    const contractCandidateCC =
      networkDistrictCommission.getContract(voteTallyCC);

    return contractCandidateCC;
  } catch (error) {
    console.error(`Error in setup: ${error}`);
    process.exit(1);
  }
}
