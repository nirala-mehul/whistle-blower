
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

#[derive(ReadWriteState, CreateTypeSpec, Clone)]
struct Report {
    id: u64,
    whistleblower_pseudonym: String,
    description: String,
    claimed: bool,
    up_votes: u64,
    down_votes: u64
}


/// The state of the whistleblower, which is persisted on-chain.
#[state]
struct ContractState {
    private_key: String,
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
fn initialize(_ctx: ContractContext, private_key: String) -> ContractState {
    assert_ne!(
        private_key, "",
        "The description af a whistleblower cannot be empty."
    );

    ContractState {
        private_key: private_key,
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
fn add_report(ctx: ContractContext, state: ContractState, report_description: String, pkey: String, whistleblower_pseudonym: String) -> u64 {
    verify(ctx.sender, pkey, whistleblower_pseudonym.clone());
    assert!(state.whistleblowers.contains(&ctx.sender), "Not an eligible whistleblower");

    let mut new_state = state;

    let report_count = new_state.report_count;
    let report = Report{
        id: report_count,
        whistleblower_pseudonym: whistleblower_pseudonym.clone(),
        description: report_description,
        claimed: false,
        up_votes: 0,
        down_votes: 0
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
    new_state.report_count
}


#[action(shortname = 0x03)]
fn get_my_reports(ctx: ContractContext, state: ContractState, pkey: String, whistleblower_pseudonym: String) -> SortedVecSet<u64> {
    verify(ctx.sender, pkey, whistleblower_pseudonym.clone());

    if let Some(report_ids) = state.whistleblower_reports.get(&whistleblower_pseudonym) {
        return report_ids.clone();
    }
    return SortedVecSet::new();
}

#[action(shortname = 0x04)]
fn vote(ctx: ContractContext, state: ContractState, report_id: u64, upvote: bool) -> bool {
    let mut new_state = state;
    
    if let Some(report) = new_state.reports.get_mut(&report_id) {
        if upvote {
            report.up_votes = report.up_votes+1;
        }
        else {
            report.down_votes = report.down_votes+1;
        }
        return true;
    }

    return false;
}

fn verify(address: Address, public_key_hex: String, pseudonym_hex: String) {

}


//     let mut user_address: [u8; 21] = [0; 21];
//     user_address[1..].copy_from_slice(&address.identifier);

//     let message = hex::encode(user_address);

//     // Decode the hexadecimal signature
//     let signature_bytes = hex::decode(pseudonym_hex).expect("Failed to decode hex pseudonym");
//     let mut signature_bytes1: [u8; 64] = [0; 64];
//     signature_bytes1.copy_from_slice(&signature_bytes);

//     // Decode the hexadecimal public key
//     let public_key_bytes = hex::decode(public_key_hex).expect("Failed to decode hex public key");

//     // Create an Ed25519 public key
//     let public_key = PublicKey::from_bytes(&public_key_bytes).expect("Failed to create Ed25519 public key");

//     // Verify the signature

//     let signature = Signature::new(signature_bytes1);
//     public_key.verify(message.as_bytes(), &signature).expect("Failed to verify signature");
// }

// fn verify2(address: [u8; 20], key: String, pseudonym: String) {
//     let mut user_address: [u8; 21] = [0; 21];
//     user_address[1..].copy_from_slice(&address);

//     let message = hex::encode(user_address);

//     // Decode the hexadecimal signature
//     let signature = hex::decode(pseudonym).expect("Failed to decode hex pseudonym");

//     // Convert the hex public key to a PKey
//     let public_key =
//         PKey::public_key_from_der(&hex::decode(key).expect("Failed to decode hex public key"))
//             .expect("Failed to load public key");

//     let mut verifier =
//         sign::Verifier::new(MessageDigest::sha256(), &public_key).expect("Failed to create verifier");
//     verifier
//         .update(message.as_bytes())
//         .expect("Failed to update verifier with message");
//     assert!(
//         verifier
//             .verify(&signature)
//             .expect("Failed to verify pseudonym"),
//         "pseudonym is not valid"
//     );
// }