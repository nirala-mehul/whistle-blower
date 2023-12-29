/*
 * Copyright (C) 2022 - 2023 Partisia Blockchain Foundation
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import { TransactionApi } from "../client/TransactionApi";
import { vote, addReport, addWhistleblower } from "./WhistleblowerGenerated";
import { getContractAddress } from "../AppState";

/**
 * API for the token contract.
 * This minimal implementation only allows for transferring tokens to a single address.
 *
 * The implementation uses the TransactionApi to send transactions, and ABI for the contract to be
 * able to build the RPC for the transfer transaction.
 */
export class WhistleblowerApi {
  private readonly transactionApi: TransactionApi;

  constructor(transactionApi: TransactionApi) {
    this.transactionApi = transactionApi;
  }

  readonly addWhistleblower = (whistleblower_address: string) => {
    const address = getContractAddress();
    if (address === undefined) {
      throw new Error("No address provided");
    }
    // First build the RPC buffer that is the payload of the transaction.
    const rpc = addWhistleblower(whistleblower_address);
    // Then send the payload via the transaction API.
    return this.transactionApi.sendTransactionAndWait(address, rpc, 10_000);
  };

  readonly addReport = (report: string, public_key: string, pseudonym: string) => {
    const address = getContractAddress();
    if (address === undefined) {
      throw new Error("No address provided");
    }
    // First build the RPC buffer that is the payload of the transaction.
    const rpc = addReport(report, public_key, pseudonym);
    // Then send the payload via the transaction API.
    return this.transactionApi.sendTransactionAndWait(address, rpc, 10_000);
  };

  /**
   * Build and send sign transaction.
   */
  readonly vote = (reportId: number, upvote: boolean) => {
    const address = getContractAddress();
    if (address === undefined) {
      throw new Error("No address provided");
    }
    // First build the RPC buffer that is the payload of the transaction.
    const rpc = vote(reportId, upvote);
    // Then send the payload via the transaction API.
    return this.transactionApi.sendTransactionAndWait(address, rpc, 10_000);
  };
}
