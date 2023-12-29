/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import BN from "bn.js";
import {
  AbiParser,
  AbstractBuilder,
  BigEndianReader,
  FileAbi,
  FnKinds,
  FnRpcBuilder,
  RpcReader,
  ScValue,
  ScValueEnum,
  ScValueOption,
  ScValueStruct,
  StateReader,
  TypeIndex,
  StateBytes,
  BlockchainAddress,
  ScValueMap,
  ScValueNumber,
} from "@partisiablockchain/abi-client";
import { BigEndianByteOutput } from "@secata-public/bitmanipulation-ts";
import { getAccount, getContractAbi } from "../AppState";


type Option<K> = K | undefined;

interface Report {
  id: number,
  whistleblower_pseudonym: string;
  description: string;
  claimed: boolean;
  up_votes: number;
  down_votes: number;
}

export interface WhistleblowerState {
  whistleblowers: BlockchainAddress[];
  whistleblower_reports: Map<string, number[]>;
  reports: Map<number, Report>
  owner: BlockchainAddress;
  report_count: number;
}

function fromScValueWhistleblowerState(structValue: ScValueStruct): WhistleblowerState {
  let whistleblower_reports = new Map<string, number[]>();
  (structValue.getFieldValue("maps") as ScValueMap).map.forEach((v, k) => {
    let whistleblower_pseudonym = k.stringValue();
    let reportIds = v.setValue().values.map((sc1) => sc1.asBN().toNumber());
    whistleblower_reports.set(whistleblower_pseudonym, reportIds);
  });

  let reports = new Map<number, Report>();
  (structValue.getFieldValue("maps1") as ScValueMap).map.forEach((v, k) => {
    const reportId = (k as ScValueNumber).asBN().toNumber();
    const reportStruct = (v as ScValueStruct);
    const report = {
      id: reportStruct.getFieldValue("id")?.asBN().toNumber(),
      whistleblower_pseudonym: reportStruct.getFieldValue("value")?.stringValue(),
      description: reportStruct.getFieldValue("data")?.stringValue(),
      up_votes: reportStruct.getFieldValue("inc")?.asBN().toNumber(),
      down_votes: reportStruct.getFieldValue("dec")?.asBN().toNumber(),
      claimed: false
    } as Report;

    reports.set(reportId, report);
  })

  return {
    whistleblowers: structValue
      .getFieldValue("addresses")!
      .setValue()
      .values.map((sc1) => BlockchainAddress.fromBuffer(sc1.addressValue().value)),
    whistleblower_reports,
    reports,
    owner: BlockchainAddress.fromBuffer(structValue.getFieldValue("owner")!.addressValue().value),
    report_count: structValue.getFieldValue("count")!.asBN().toNumber(),
  };
}

export function deserializeWhistleblowerState(state: StateBytes): WhistleblowerState {
  console.log(getContractAbi())
  const scValue = new StateReader(state.state, getContractAbi(), state.avlTrees).readState();
  return fromScValueWhistleblowerState(scValue);
}

export interface SecretVarId {
  rawId: number;
}

export function newSecretVarId(rawId: number): SecretVarId {
  return { rawId };
}

export function initialize(): Buffer {
  const fnBuilder = new FnRpcBuilder("initialize", getContractAbi());
  return fnBuilder.getBytes();
}

export function addWhistleblower(address: string): Buffer {
  const fnBuilder = new FnRpcBuilder("add_address", getContractAbi());
  fnBuilder.addAddress(address);

  return fnBuilder.getBytes();
}

export function addReport(report: string, public_key: string, pseudonym: string): Buffer {
  const fnBuilder = new FnRpcBuilder("add_map", getContractAbi());
  fnBuilder.addString(report);
  fnBuilder.addString(public_key);
  fnBuilder.addString(pseudonym);

  return fnBuilder.getBytes();
}

export function vote(reportId: number, upVote: boolean): Buffer {
  const fnBuilder = new FnRpcBuilder("incc", getContractAbi());
  fnBuilder.addU64(reportId);
  fnBuilder.addBool(upVote);

  return fnBuilder.getBytes();
}
