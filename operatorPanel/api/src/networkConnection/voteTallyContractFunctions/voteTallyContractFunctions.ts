import { getVoteTallyContractAndGateway } from "../networkConnection";

type TTallyRecord = {
  tallyKey: string;
  candidateId: string;
  electionId: string;
  constituencyNumber: number;
  constituencyName: string;
  voteCount: number;
  createdAt: string;
  updatedAt: string;
};

export async function CastVote(
  candidateId: string,
  electionId: string,
  constituencyNumber: string,
  constituencyName: string,
  permitKey: string
) {
  const voteTallyContract = await getVoteTallyContractAndGateway();
  try {
    const response = await voteTallyContract.submitTransaction(
      "CastVote",
      candidateId,
      electionId,
      constituencyNumber,
      constituencyName,
      permitKey
    );
    const tallyObjectJSONResponse = JSON.parse(response.toString("utf-8")) as {
      message: string;
      data: TTallyRecord | null;
    };
    return tallyObjectJSONResponse;
  } catch (error) {
    console.error(`Error in setup: ${error}`);
  }
}

export async function GetTally(
  candidateId: string,
  constituencyNumber: string,
  constituencyName: string,
  electionId: string
) {
  const voteTallyContract = await getVoteTallyContractAndGateway();
  try {
    const response = await voteTallyContract.submitTransaction(
      "GetTally",
      candidateId,
      constituencyNumber,
      constituencyName,
      electionId
    );
    const tallyObjectJSONResponse = JSON.parse(response.toString("utf-8")) as {
      message: string;
      data: TTallyRecord | null;
    };
    return tallyObjectJSONResponse;
  } catch (error) {
    console.error(`Error in setup: ${error}`);
  }
}

export async function GetConstituencyTallies(
  electionId: string,
  constituencyNumber: string,
  constituencyName: string
) {
  const voteTallyContract = await getVoteTallyContractAndGateway();
  try {
    const response = await voteTallyContract.submitTransaction(
      "GetConstituencyTallies",
      electionId,
      constituencyNumber,
      constituencyName
    );
    const tallyObjectJSONResponse = JSON.parse(response.toString("utf-8")) as {
      message: string;
      data: TTallyRecord[] | null;
    };
    return tallyObjectJSONResponse;
  } catch (error) {
    console.error(`Error in setup: ${error}`);
  }
}

export async function GetElectionTalliesCount(electionId: string) {
  const voteTallyContract = await getVoteTallyContractAndGateway();
  try {
    const response = await voteTallyContract.submitTransaction(
      "GetElectionTallies",
      electionId
    );
    const tallyObjectJSONResponse = JSON.parse(response.toString("utf-8")) as {
      message: string;
      data: number | null;
    };
    return tallyObjectJSONResponse;
  } catch (error) {
    console.error(`Error in setup: ${error}`);
  }
}
