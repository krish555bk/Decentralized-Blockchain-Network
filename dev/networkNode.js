const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const uuid = require('uuid/v1');
const port = process.argv[2];
// we will ise UUID random srting as the node address

const bitcoin = new Blockchain();
const nodeAddress = uuid().split('-').join('-');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// GET ENTIRE BLOCKCHAIN
app.get('/blockchain', function (req, res) {
    res.send(bitcoin);
});

// CREATE A NEW TRANSACTION
app.post('/transaction', function (req, res) {
    const blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    res.json({ note: `Transaction will be added in block ${blockIndex}.` });
});

// MINE A BLOCK
app.get('/mine', function (req, res) {
    const lastBlock = bitcoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock['index'] + 1
    };
    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);

    bitcoin.createNewTransaction(12.5, "00", nodeAddress)

    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);
    res.json({
        note: "New block mined successfully.",
        block: newBlock
    });
});

//REGISTED NODE and broadcast to whole network
app.post('/request-and-broadcast-node', function (req, res) {
    const newNodeUrl = req.body.newNodeUrl;
});
// register a node with a network
app.post('/register-node', function (req, res) {
    const newNodeUrl = req.body.newNodeUrl;
});

app.post('/register-nodes-bulk', function (req, res) {
    const newNodeUrl = req.body.newNodeUrl;
});





app.listen(port);