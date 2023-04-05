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

const app = express();
const port = process.env.PORT || 4003;

const CONTRACT_ADDRESS = '0x90A29e100D63024ef734F4Cb56CCF2bB16e72494';
const BNB_TEST_NETWORK = 'https://data-seed-prebsc-1-s1.binance.org:8545';
const BNB_TEST_NETWORK_BLOCK_EXPLORER = 'https://testnet.bscscan.com'
const provider = new ethers.JsonRpcProvider(BNB_TEST_NETWORK);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

app.use(cors()); // Allow all origins (for demonstration only)
app.use(express.json()); // Add middleware to parse request body as JSON

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the Birth act registry service!');
});

// Route to add a new birth act to the blockchain
app.post('/birth-acts', async (req, res) => {
  try {
    const result = await contract.addBirthAct(req.body);
    res.status(201).json({
      transactionHash: result.hash,
      blockExplorerLink: `${BNB_TEST_NETWORK_BLOCK_EXPLORER}/tx/${result.hash}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding birth act' });
  }
});

// Route to get a birth act from the blockchain
app.get('/birth-acts/:hash', async (req, res) => {
  try {
    const result = await contract.getBirthActById(req.params.hash);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error getting birth act' });
  }
});

// Route to get all birth act hashes from the blockchain
app.get('/birth-acts', async (req, res) => {
  try {
    const result = await contract.getAllBirthActs();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error getting birth act hashes' });
  }
});

// Error handling middleware
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Process event listeners
process.on('uncaughtException', function (err) {
  console.error('Uncaught Exception:', err.stack);
});

process.on('unhandledRejection', function (reason, promise) {
  console.error('Unhandled Rejection:', reason.stack || reason);
});

// Start the server
app.listen(port, () => {
  console.log(`Birth act service listening at http://localhost:${port}`);
});
