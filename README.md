# 🔐 Encrypt-EIP: Enhanced Privacy Protocol

## Overview

Encrypt-EIP is a cutting-edge Clarity smart contract designed to provide robust, decentralized encryption and secure data exchange mechanisms on the Stacks blockchain.

### 🌟 Key Features

- Secure, immutable data encryption
- Decentralized access control
- Privacy-preserving data exchange
- Flexible encryption management

## Installation

### Prerequisites

- Clarinet
- Stacks Blockchain
- Node.js

### Setup

```bash
git clone https://github.com/yourusername/encrypt-eip.git
cd encrypt-eip
clarinet check
```

## Usage

### Basic Encryption

```clarity
(encrypt-data "sensitive-information" public-key)
```

### Data Verification

```clarity
(verify-encrypted-data encrypted-data signature)
```

## Architecture

The Encrypt-EIP contract provides a comprehensive framework for managing encrypted data:

```mermaid
graph TD
    A[Data Source] -->|Encrypt| B[Encrypted Data]
    B -->|Store| C[Decentralized Storage]
    C -->|Retrieve| D[Authorized Parties]
    D -->|Verify| E[Signature Validation]
    E -->|Decrypt| F[Original Data]
```

## Contract Components

1. **Encryption Mechanism**
   - Advanced encryption techniques
   - Public/private key management
   - Signature-based verification

2. **Access Control**
   - Fine-grained permission settings
   - Dynamic access revocation
   - Role-based encryption

3. **Data Integrity**
   - Cryptographic hash tracking
   - Immutable data storage
   - Tamper-evident design

## Security Considerations

- Multi-layer encryption protocols
- Decentralized key management
- Prevention of unauthorized data access
- Compliance with privacy standards

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

# shivanirajput2597/Stack
# README.md
### Stack Blockchain

### Description
The Stackcoin Contract is deployed on the stacks blockchain which is use for creating fungible tokens .
Here we have fungible and non-fungible token for future transactions for different contracts according to the requirement 
we have defined in this repository.

The Stacks blockchain provides a novel consensus mechanism called proof of transfer (PoX), which uniquely connects Stacks to Bitcoin security and enables cross-chain interactions.

### Features 

##### [A] Transaction Types
- Stack transfer transaction
- Contract deployment transaction
- Contract execution transaction 

##### [B] Token Standard
- Fungible token (FT)
- Non-fungible token (NFT)


### Technologies

- [x] Clarity
- [x] Stack API
- [x] Visual Studio Code


### Prerequisites
- Node.js 14+ environment
- Clarinet 
- Stack API
- Visual Studio Code

### Setup
````
npx @stacks/cli run new
````

### Unit test cases for the coin contract 

```
#[test]
fn test_coinbase() {
  let result = run("coinbase", &vec![]);
  assert_eq!(result, Ok(Value::Uint(100)));
}

#[test]
fn test_transfer() {
  let result = run("transfer", &vec!["0x123", "10"]);
  assert_eq!(result, Ok(Value::Bool(true)));
}

#[test]
fn test_balanceOf() {
  let result = run("balanceOf", &vec!["0x123"]);
  assert_eq!(result, Ok(Value::Uint(0)));
}

#[test]
fn test_name() {
  let result = run("name", &vec![]);
  assert_eq!(result, Ok(Value::Str("Stackcoin".into())));
}

#[test]
fn test_symbol() {
  let result = run("symbol", &vec![]);
  assert_eq!(result, Ok(Value::Str("STX".into())));
}

#[test] 
fn test_totalSupply() {
  let result = run("totalSupply", &vec![]);
  assert_eq!(result, Ok(Value::Uint(1000000)));
}
```

### Running the tests 

```
cargo test
```

### Deploy steps

1. Build the clarity contract
```
clarinet build coin
```

2. Deploy the contract 
```
clarinet deploy coin.clar
```

3. Test transactions
```
clarinet transfer 0x123 10 
```

### Architecture 

```
src/
  coin.clar    # Main Clarity contract 
  functions.ts # Helper functions
  types.ts     # Type definitions
tests/  
  coin.test.ts # Unit test cases
README.md      # Project documentation
```

### Contract Interface

The contract exposes the following public functions:

```clarity
;; Token Interface
(define-public (transfer (to principal) (amount uint))) 
(define-public (balanceOf (account principal)))
(define-read-only (name))
(define-read-only (symbol)) 
(define-read-only (totalSupply))

;; Minting function
(define-private (coinbase)) 
```

### FUTURE 
- Add staking functionality
- Support more token standards
- Implement governance features
- Add liquidity provision
- Cross-chain bridges

### AUTHOR
```
Name :- Shivani Rajput 
```

### LICENSE 
This project is licensed under the MIT License.






# shivanirajput2597/Stack
# coin.clar
;; coin contract
(define-fungible-token coin)

;; Constants 
(define-constant err-insufficient-funds u2)

(define-constant initial-supply u1000000)

(define-data-var total-supply uint initial-supply)

;; Get token name
(define-read-only (name)
  (ok "Stackcoin")
)

;; Get token symbol  
(define-read-only (symbol)
  (ok "STX")
)

;; Get total supply
(define-read-only (totalSupply)
  (ok (var-get total-supply))
)

;; Get balance for address
(define-read-only (balanceOf (address principal))
  (ok (ft-get-balance coin address))
)

;; Transfer tokens
(define-public (transfer (to principal) (amount uint))
  (begin 
    (asserts! (>= (ft-get-balance coin tx-sender) amount) 
      (err err-insufficient-funds))
      
    (try! (ft-transfer? coin amount tx-sender to))
    (ok true))
)

;; Mint initial supply 
(define-private (coinbase)
  (ft-mint? coin u100 tx-sender)
)

;; Initialize
(begin
  (try! (coinbase))
  (print "Contract initialized"))

# shivanirajput2597/Stack
# types.ts
// Types for contract state
export interface ContractState {
  totalSupply: number;
  balances: Map<string, number>;
}

// Transaction type for moving coins 
export interface Transfer {
  from: string; 
  to: string;
  amount: number;
}

// Result type for function responses
export type Result<T> = {
  success: true;  
  value: T;
} | {
  success: false;
  error: string;
}

export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
}

export type Address = string;
export type Amount = number;

# functions.ts
import { ContractState, Transfer, Result } from './types';

// Helper function to validate transfer
export function validateTransfer(
  state: ContractState, 
  transfer: Transfer
): Result<void> {
  const balance = state.balances.get(transfer.from) || 0;
  
  if (balance < transfer.amount) {
    return {
      success: false,
      error: 'Insufficient funds'
    };
  }

  return {
    success: true,
    value: undefined
  };
}

// Update balances after transfer
export function updateBalances(
  state: ContractState,
  transfer: Transfer
): ContractState {
  const fromBalance = state.balances.get(transfer.from) || 0;
  const toBalance = state.balances.get(transfer.to) || 0;

  state.balances.set(transfer.from, fromBalance - transfer.amount);
  state.balances.set(transfer.to, toBalance + transfer.amount);

  return state;
}

// Mint new coins
export function mint(
  state: ContractState,
  address: string,
  amount: number 
): ContractState {
  const balance = state.balances.get(address) || 0;
  state.balances.set(address, balance + amount);
  state.totalSupply += amount;
  return state;
}

// Get balance for address
export function getBalance(
  state: ContractState,
  address: string
): number {
  return state.balances.get(address) || 0;
}

// Burn coins
export function burn(
  state: ContractState,
  address: string,
  amount: number
): Result<ContractState> {
  const balance = state.balances.get(address) || 0;
  
  if (balance < amount) {
    return {
      success: false,
      error: 'Insufficient balance to burn'
    };
  }

  state.balances.set(address, balance - amount);
  state.totalSupply -= amount;

  return {
    success: true, 
    value: state
  };
}
 # README.md
# Meme-Generator

<img src="https://i.imgur.com/VfkX79V.png" alt="logo" title="logo" />

Welcome to Meme Generator! This application lets you create custom memes by adding text captions to popular meme images.

## Features

- Choose from a selection of popular meme images
- Add top and bottom text to your meme
- Customize the text styling
- Download your meme image

## Technologies Used

- React.js
- CSS
- React Icons
- HTML 5 Canvas

## Live Demo

Check out the live demo at: [Meme Generator](https://shhivam-yt-meme-generator.netlify.app/)
End File# public/index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    <title>Meme-Generator</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <script src="https://kit.fontawesome.com/8b5f5ff0da.js" crossorigin="anonymous"></script>
  </body>
</html>
End File# Shhivam-Agarwal/Meme-Generator
import React from "react";
import "./App.css";
import { Header } from "./components/Header";
import { Main } from "./components/Main";
import "./index.css";

function App() {
  return (
      <div>
      <Header/>
      <Main/>
    </div>
  );
}

export default App;
End File# Shhivam-Agarwal/Meme-Generator
// import React from "react";
// import memesData from "../memesData";

// function Meme() {
//   function getMemeImage() {
//     const memesArray = memesData.data.memes;
//     const random = Math.floor(Math.random() * memesArray.length);
//     const url = memesArray[random].url;
//     console.log(url);
//   }
//   return (
//     <div>
//       <button onClick={getMemeImage} className="meme">
//         Hi,Click me
//       </button>
//     </div>
//   );
// }

// export default Meme;

import React, { useState, createRef } from "react";
import { exportComponentAsJPEG } from "react-component-export-image";
import "../StyleSheet/Meme.css";

function Meme() {
  const [meme, setMeme] = useState({
    topText: "",
    bottomText: "",
    randomImage: "./logo192.png",
  });

  const getMemeImage = () => {
    const randomNumbers = Math.floor(Math.random() * allMemes.length);
    setMeme((prevMeme) => ({
      ...prevMeme,
      randomImage: allMemes[randomNumbers].url,
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setMeme((prevMeme) => ({
      ...prevMeme,
      [name]: value,
    }));
  };

  const [allMemes, setAllMemes] = React.useState([]);

  const memeRef = createRef();

  React.useEffect(() => {
    fetch("https://api.