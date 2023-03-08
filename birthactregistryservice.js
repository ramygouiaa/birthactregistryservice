/**
 * Author: Ramy Gouiaa
 * 
 * Test server to interact with BirthRegistry contract. 
 * The SC is deployed on Goerli test network
 * 
 */

const express = require('express');
const { ethers } = require('ethers');
const cors = require('cors');
const abi = require('./abi.json');

// Initialize Express app
const app = express();

//allow all origins (for demonstration only)
app.use(cors({origin:"*"}));

const port = process.env.PORT || 3000;

// Infura API key and contract address
const INFURA_API_KEY = '75dc99fdaba0433daff2008984dad1ae';
const CONTRACT_ADDRESS = '0xa14e4dA14d8956522d35277703b6a5F9F4111f76';
const privateKey = '67a47f2e2ab188abc249fe795fcad8edc52b9102c401cc5b1f687014232e5d30';

//initialize provider to goerli infura
const provider = new ethers.JsonRpcProvider('https://goerli.infura.io/v3/' + INFURA_API_KEY);
    
const wallet = new ethers.Wallet(privateKey, provider);

// Load contract ABI
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

// Add middleware to parse request body as JSON
app.use(express.json());

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
    const result = await contract.getBirthAct(hash);

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
    const result = await contract.getAllBirthActHashes();

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
