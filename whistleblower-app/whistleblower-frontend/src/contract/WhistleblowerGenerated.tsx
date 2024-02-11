/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  FnRpcBuilder,
  ScValueStruct,
  StateReader,
  StateBytes,
  BlockchainAddress,
  ScValueMap,
  ScValueNumber,
  ContractAbi,
} from "@partisiablockchain/abi-client";

type Option<K> = K | undefined;

export interface Report {
  id: number;
  timestamp: Date;
  whistleblower_pseudonym: string;
  description: string;
  claimed: boolean;
  status: number;
  up_votes: number;
  down_votes: number;
}

export interface WhistleblowerState {
  whistleblowers: BlockchainAddress[];
  whistleblower_reports: Map<string, number[]>;
  reports: Map<number, Report>;
  owner: BlockchainAddress;
  report_count: number;
}

function fromScValueWhistleblowerState(
  structValue: ScValueStruct
): WhistleblowerState | any {
  let whistleblower_reports = new Map<string, number[]>();
  (
    structValue.getFieldValue("whistleblower_reports") as ScValueMap
  ).map.forEach((v, k) => {
    let whistleblower_pseudonym = k.stringValue();
    let reportIds = v.setValue().values.map((sc1) => sc1.asBN().toNumber());
    whistleblower_reports.set(whistleblower_pseudonym, reportIds);
  });

  let reports = new Map<number, Report>();
  (structValue.getFieldValue("reports") as ScValueMap).map.forEach((v, k) => {
    const reportId = (k as ScValueNumber).asBN().toNumber();
    const reportStruct = v as ScValueStruct;
    const report = {
      id: reportStruct.getFieldValue("id")?.asBN().toNumber(),
      timestamp: new Date(
        parseInt(reportStruct.getFieldValue("timestamp")?.stringValue())
      ),
      whistleblower_pseudonym: reportStruct
        .getFieldValue("value")
        ?.stringValue(),
      description: reportStruct.getFieldValue("description")?.stringValue(),
      status: reportStruct.getFieldValue("status")?.asNumber(),
      up_votes: reportStruct.getFieldValue("up_votes")?.asBN().toNumber(),
      down_votes: reportStruct.getFieldValue("down_votes")?.asBN().toNumber(),
      claimed: false,
    } as Report;

    reports.set(reportId, report);
  });

  return {
    whistleblowers: structValue
      .getFieldValue("whistleblowers")!
      .setValue()
      .values.map((sc1) =>
        BlockchainAddress.fromBuffer(sc1.addressValue().value)
      ),
    whistleblower_reports,
    reports,
    owner: BlockchainAddress.fromBuffer(
      structValue.getFieldValue("owner")!.addressValue().value
    ),
    report_count: structValue.getFieldValue("report_count")!.asBN().toNumber(),
  };
}

export function deserializeWhistleblowerState(
  state: StateBytes,
  contractAbi: ContractAbi
): WhistleblowerState {
  const scValue = new StateReader(
    state.state,
    contractAbi,
    state.avlTrees
  ).readState();
  return fromScValueWhistleblowerState(scValue);
}

export interface SecretVarId {
  rawId: number;
}

export function newSecretVarId(rawId: number): SecretVarId {
  return { rawId };
}

export function initialize(contractAbi: ContractAbi): Buffer {
  const fnBuilder = new FnRpcBuilder("initialize", contractAbi);
  return fnBuilder.getBytes();
}

export function addWhistleblower(
  contractAbi: ContractAbi,
  address: string
): Buffer {
  const fnBuilder = new FnRpcBuilder("add_whistleblower", contractAbi);
  fnBuilder.addAddress(address);

  return fnBuilder.getBytes();
}

export function addReport(
  contractAbi: ContractAbi,
  timestamp: string,
  report: string,
  public_key: string,
  pseudonym: string
): Buffer {
  const fnBuilder = new FnRpcBuilder("add_report", contractAbi);
  fnBuilder.addString(timestamp);
  fnBuilder.addString(report);
  fnBuilder.addString(public_key);
  fnBuilder.addString(pseudonym);

  return fnBuilder.getBytes();
}

export function approve(
  contractAbi: ContractAbi,
  reportId: number,
  approved: boolean
): Buffer {
  const fnBuilder = new FnRpcBuilder("approve", contractAbi);
  fnBuilder.addU64(reportId);
  fnBuilder.addBool(approved);

  return fnBuilder.getBytes();
}

export function vote(
  contractAbi: ContractAbi,
  reportId: number,
  upVote: boolean
): Buffer {
  const fnBuilder = new FnRpcBuilder("vote", contractAbi);
  fnBuilder.addU64(reportId);
  fnBuilder.addBool(upVote);

  return fnBuilder.getBytes();
}
