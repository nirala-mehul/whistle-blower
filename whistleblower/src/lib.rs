
#![doc = include_str!("../README.md")]
#![allow(unused_variables)]

#[macro_use]
extern crate pbc_contract_codegen;
extern crate pbc_contract_common;

use create_type_spec_derive::CreateTypeSpec;
use pbc_contract_common::address::Address;
use pbc_contract_common::context::ContractContext;
use pbc_contract_common::sorted_vec_map::{SortedVecMap, SortedVecSet};
use read_write_state_derive::ReadWriteState;
use ed25519_dalek::PublicKey;
use ed25519_dalek::Signature;
use ed25519_dalek::Verifier;
use hex;

#[derive(ReadWriteState, CreateTypeSpec, Clone)]
struct Report {
    id: u64,
    timestamp: String,
    whistleblower_pseudonym: String,
    description: String,
    claimed: bool,
    up_votes: u64,
    down_votes: u64,
    status: u8
}


/// The state of the whistleblower, which is persisted on-chain.
#[state]
struct ContractState {
    pub owner: Address,
    whistleblowers: SortedVecSet<Address>,
    whistleblower_reports: SortedVecMap<String, SortedVecSet<u64>>,
    pub reports: SortedVecMap<u64, Report>,
    pub report_count: u64
}


/// Initialize a new whistleblower to sign.
///
/// # Arguments
///
/// * `_ctx` - the contract context containing information about the sender and the blockchain.
///
/// # Returns
///
/// The initial state of the whistleblower, with no signers.
///
#[init]
fn initialize(_ctx: ContractContext) -> ContractState {
    ContractState {
        owner: _ctx.sender,
        reports: SortedVecMap::new(),
        report_count: 0,
        whistleblowers: SortedVecSet::new(),
        whistleblower_reports: SortedVecMap::new()
    }
}

#[action(shortname = 0x01)]
fn add_whistleblower(ctx: ContractContext, state: ContractState, whistleblower: Address) -> ContractState {
    assert_eq!(ctx.sender, state.owner, "Only owner can add whistleblower");
    let mut new_state = state;
    new_state.whistleblowers.insert(whistleblower);
    new_state
}

#[action(shortname = 0x02)]
fn add_report(ctx: ContractContext, state: ContractState, timestamp: String, report_description: String, pkey: String, whistleblower_pseudonym: String) -> ContractState {
    verify(ctx.sender, pkey, whistleblower_pseudonym.clone());
    assert!(state.whistleblowers.contains(&ctx.sender), "Not an eligible whistleblower");

    let mut new_state = state;

    let report_count = new_state.report_count;
    let report = Report{
        id: report_count,
        timestamp: timestamp,
        whistleblower_pseudonym: whistleblower_pseudonym.clone(),
        description: report_description,
        claimed: false,
        up_votes: 0,
        down_votes: 0,
        status: 0
    };

    // Check if the key already exists in the map
    if let Some(set) = new_state.whistleblower_reports.get_mut(&whistleblower_pseudonym) {
        // If the key exists, insert the value into the set
        set.insert(report_count);
    } else {
        // If the key doesn't exist, create a new set and insert the value
        let mut new_set = SortedVecSet::new();
        new_set.insert(report_count);

        new_state.whistleblower_reports.insert(whistleblower_pseudonym, new_set);
    }

    new_state.reports.insert(report_count, report);

    new_state.report_count = report_count+1;
    new_state
}

#[action(shortname = 0x03)]
fn approve(ctx: ContractContext, state: ContractState, report_id: u64, approve: bool) -> ContractState {
    assert_eq!(ctx.sender, state.owner, "Only owner can approve");
    let mut new_state = state;
    
    if let Some(report) = new_state.reports.get_mut(&report_id) {
        if approve {
            report.status = 2;
        }
        else {
            report.status = 1;
        }
    }

    return new_state
}

#[action(shortname = 0x04)]
fn vote(ctx: ContractContext, state: ContractState, report_id: u64, upvote: bool) -> ContractState {
    let mut new_state = state;
    
    if let Some(report) = new_state.reports.get_mut(&report_id) {
        if upvote {
            report.up_votes = report.up_votes+1;
        }
        else {
            report.down_votes = report.down_votes+1;
        }
    }

    return new_state
}

fn verify(address: Address, public_key_hex: String, pseudonym_hex: String) {
    let mut user_address: [u8; 21] = [0; 21];
    user_address[1..].copy_from_slice(&address.identifier);

    verify_signature(&public_key_hex, &user_address,&pseudonym_hex);
}

fn verify_signature(public_key_hex: &str, message: &[u8], signature_hex: &str) {
    let public_key = PublicKey::from_bytes(&hex::decode(public_key_hex).unwrap()).unwrap();
    let signature: Signature = Signature::from_bytes(&hex::decode(signature_hex).unwrap()).unwrap();
    assert!(
        public_key.verify(&message, &signature).is_ok(),
        "UnAuthorized"
    );
}