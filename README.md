prequisites:
node, truffle ,ganache(cli or ui)
terminal 1: npm -g install truffle (if not installed)
ter 1: npm install -g ganache (cli version of ganache if not installed)
terminal1: npm i(installs recent dependencies)
ter 1 :truffle compile
ter 2: ganache-cli 
check for the port number (usually it is 8545)
if u get the different port number change it in truffle-config.js
ter1:
truffle migrate
next step
ter 1: 
cd client
npm i
npm install -save web3
npm
npm start

setting up metamask:
make sure u have custom network setup
if not follow the steps :
go to the network drop down( left, top right)
click on add custom network
Fill in the details:
Network Name: Localhost 8545
RPC URL: http://localhost:8545
Chain ID: 1337
click Save
custom network set !!!

account setup:
get private key from ganache-cli(ter2)
then go to your metamask -->add acount--> private key --> paste--> import
you account is set !!!!

#   f o o d - s u p p l y - c h a i n 
 
 
