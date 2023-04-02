/**
 * Author: Ramy Gouiaa
 * 
 * Test server to interact with BirthRegistry contract. 
 * The SC is deployed on BNB smart chain test Network
 * 
 */

const express = require('express');
const { ethers } = require('ethers');
const cors = require('cors');
const abi = require('./abi.json');
require('dotenv').config();

// Initialize Express app
const app = express();

//allow all origins (for demonstration only)
app.use(cors({origin:"*"}));

const port = process.env.PORT || 4003;

//BNB test Network jsonRPCProvider
const BNB_TEST_NETWORK = 'https://data-seed-prebsc-1-s1.binance.org:8545'

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = '0x90A29e100D63024ef734F4Cb56CCF2bB16e72494';

//initialize provider to bnb test network
const provider = new ethers.JsonRpcProvider(BNB_TEST_NETWORK);
    
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Load contract ABI
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

// Add middleware to parse request body as JSON
app.use(express.json());

app.get('/', (req, res) => {
res.send('Welcome to the Birth act registry service!')
})

// Route to add a new birth act to the blockchain
app.post('/addbirthact', async (req, res) => {
  try {

    console.log(req.body);
    // Call the addBirthAct function in the contract with the birth act data
    const result = await contract.addBirthAct(req.body);

    // Return the transaction hash
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding birth act');
  }
});

// Route to get a birth act from the blockchain
app.get('/getbirthact', async (req, res) => {
  try {
    // Get the birth act hash from the query string
    const hash = req.query.hash;
    console.log(hash);
    // Call the getBirthAct function in the contract with the hash parameter
    const result = await contract.getBirthActById(hash);

    // Return the birth act data as JSON
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error getting birth act');
  }
});

// Route to get all birth act hashes from the blockchain
app.get('/getall', async (req, res) => {
  try {
    // Call the getAllBirthActHashes function in the contract
    const result = await contract.getAllBirthActs();

    // Return the birth act hashes as JSON
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error getting birth act hashes');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Birth act service listening at http://localhost:${port}`);
});
