![whistleblower](https://d6jxgaftxvagq.cloudfront.net/Pictures/1024x536/4/9/7/17497_whistleblower_499593.jpg)

## Inspiration
The inspiration behind our project stems from the critical need for a secure and anonymous platform for whistleblowers to report wrongdoing without fear of reprisal or exposure. 

**Whistleblowers** play a crucial role in uncovering corruption, fraud, and other unethical behavior, but often face significant risks when coming forward. 


Our goal is to empower individuals to speak up and bring attention to injustices while protecting their identities and ensuring the integrity of their reports.


## What it does
Our whistleblower app built on the Partisia blockchain provides a secure and anonymous platform for individuals to report misconduct, corruption, or other unethical behavior. 
- Users can submit detailed reports, including evidence such as documents or multimedia files urls, through an encrypted channel. 
- Reports are securely stored and the app ensures the anonymity of whistleblowers by utilizing advanced cryptographic techniques [described below](#anonymous-design) and the decentralized nature of the Partisia blockchain. 

## How we built it

We built the whistleblower app using the Partisia blockchain platform, to make it secure and trustworthy we have added an additional layer of anonymity.

The id stored againstt the activity is replaced with psuedonym of the user. The pseudonym is generated based on the address and a private key which is hidden to the external world.

Below diagram describes the steps to get a psuedo id.

### Anonymous design
![image (1)](https://github.com/nirala-mehul/whistle-blower/assets/88541725/404264cc-91e7-482c-a6bc-d7be46068d74)

- The add report action takes in input whistleblower_pseudonym and the report that needs to be stored against it.
    ```rust
    fn add_report(..., timestamp: String, report_description: String, pkey: String, whistleblower_pseudonym: String) -> ContractState {}
    ```

- It also has a `verify` function to make sure a user is only able to use their own psuedonym.

    ```rust
    fn verify(address: Address, public_key_hex: String, pseudonym_hex: String) {
        let mut user_address: [u8; 21] = [0; 21];
        user_address[1..].copy_from_slice(&address.identifier);

        verify_signature(&public_key_hex, &user_address,&pseudonym_hex);
    }
    ```

### Backend & Frontend

- The contract is written in [Rust](https://www.rust-lang.org/) using     `partisia-contract-sdk`. The backend is powered by `nodejs`.

- The frontend interface was developed using modern web technologies including `React` and `typescript`, providing a user-friendly experience for whistleblowers to submit reports securely.

## Challenges we ran into

One of the main challenges we encountered was designing a system that provides strong anonymity guarantees while maintaining usability and accessibility. 


## Accomplishments that we're proud of

We're proud to have successfully developed a whistleblower app that prioritizes user privacy and security without compromising on functionality. 

Our app provides whistleblowers with a safe and confidential platform to report misconduct, empowering them to speak up against injustice

## What we learned

We gained valuable insights into the complexities of building secure and anonymous systems on blockchain platforms. 

We deepened our understanding of cryptographic techniques and their applications in preserving user privacy. 

Additionally, we learned about the challenges and trade-offs involved in designing user-friendly interfaces for secure communication and reporting.

## What's next for Blow the whistle

In the future, we plan to further enhance the features and capabilities of the whistleblower app. 

- This includes implementing additional privacy-preserving measures, such as **zero-knowledge proofs**.
- Reward system to promote whistle blowing.