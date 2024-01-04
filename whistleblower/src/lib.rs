
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
pub struct MapStruct {
    id: u64,
    value: String,
    data: String,
    inc: u64,
    dec: u64,
    sx: u8,
    timestamp: String
}


/// The state of the address, which is persisted on-chain.
#[state]
pub struct ContractState {
    pub owner: Address,
    addresses: SortedVecSet<Address>,
    maps: SortedVecMap<String, SortedVecSet<u64>>,
    pub maps1: SortedVecMap<u64, MapStruct>,
    pub count: u64
}


/// Initialize a new address to sign.
///
/// # Arguments
///
/// * `_ctx` - the contract context containing information about the sender and the blockchain.
///
/// # Returns
///
/// The initial state of the address, with no signers.
///
#[init]
fn initialize(_ctx: ContractContext) -> ContractState {
    ContractState {
        owner: _ctx.sender,
        maps: SortedVecMap::new(),
        count: 0,
        addresses: SortedVecSet::new(),
        maps1: SortedVecMap::new()
    }
}

#[action(shortname = 0x01)]
fn add_address(ctx: ContractContext, state: ContractState, address: Address) -> ContractState {
    assert_eq!(ctx.sender, state.owner, "Only owner can add");
    let mut new_state = state;
    new_state.addresses.insert(address);
    new_state
}

#[action(shortname = 0x02)]
fn add_map(ctx: ContractContext, state: ContractState,timestamp: String, data: String, pkey: String, value: String) -> ContractState {
    verify(ctx.sender, pkey, value.clone());
    assert!(state.addresses.contains(&ctx.sender), "Not an eligible");

    let mut new_state = state;

    let count = new_state.count;
    let report = MapStruct{
        id: count,
        timestamp: timestamp,
        value: value.clone(),
        data: data,
        inc: 0,
        dec: 0,
        sx: 0
    };

    // Check if the key already exists in the map
    if let Some(set) = new_state.maps.get_mut(&value) {
        // If the key exists, insert the value into the set
        set.insert(count);
    } else {
        // If the key doesn't exist, create a new set and insert the value
        let mut new_set = SortedVecSet::new();
        new_set.insert(count);

        new_state.maps.insert(value, new_set);
    }

    new_state.maps1.insert(count, report);

    new_state.count = count+1;
    new_state
}

#[action(shortname = 0x03)]
fn check(ctx: ContractContext, state: ContractState, id: u64, yes: bool) -> ContractState {
    assert_eq!(ctx.sender, state.owner, "Only owner can check");
    let mut new_state = state;
    
    if let Some(report) = new_state.maps1.get_mut(&id) {
        if yes {
            report.sx = 2;
        }
        else {
            report.sx = 1;
        }
    }
    new_state
}

#[action(shortname = 0x04)]
fn incc(ctx: ContractContext, state: ContractState, id: u64, check: bool) -> ContractState {
    let mut new_state = state;
    
    if let Some(report) = new_state.maps1.get_mut(&id) {
        if check {
            report.inc = report.inc+1;
        }
        else {
            report.dec = report.dec+1;
        }
    }
    new_state
}

fn verify(address: Address, key: String, value: String) {
    let mut user_address: [u8; 21] = [0; 21];
    user_address[1..].copy_from_slice(&address.identifier);

    verify_signature(&key, &user_address,&value);
}

fn verify_signature(key: &str, message: &[u8], signature_hex: &str) {
    let public_key = PublicKey::from_bytes(&hex::decode(key).unwrap()).unwrap();
    let signature: Signature = Signature::from_bytes(&hex::decode(signature_hex).unwrap()).unwrap();
    assert!(
        public_key.verify(&message, &signature).is_ok(),
        "UnAuthorized"
    );
}
