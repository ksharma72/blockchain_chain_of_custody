# Blockchain Chain of Custody Project

Project Contributors:

Kanishk Sharma (ASU ID: 1226213666),
Saketh Angirekula (ASU ID: 1230402773),
Stephanie Blossom (ASU ID: 1218718696).


This project implements an Ethereum blockchain-based chain of custody system. Follow the instructions below to set up and interact with the system.

## How to Test/Run

Before you start, navigate to the `chain_of_custody` directory where the project is located.

### Setting Up the Project

1. Install project dependencies:
    npm install

2. Initialize Truffle (only once if you haven't initialized truffle in your project):
    truffle init

3. Compile the smart contracts:
    truffle compile

4. Running Ganache
Ganache CLI is used to simulate an Ethereum blockchain. You will need to run Ganache before deploying your contracts. Open a new terminal window and run:

    ganache-cli -p 7545 -i 5777 --db C:/path/to/your/ganache_data

Note: Replace C:/path/to/your/ganache_data with the actual path where you want Ganache to store its state.

5. Deploying Contracts
With Ganache running, deploy your contracts to the local blockchain:

    truffle migrate

6.Interacting with the Blockchain, You can interact with the blockchain using the bchoc.py script. Here are some of the commands you can use:

Initialize the blockchain:
        python bchoc.py init
        
Add a new item to a case:
        python bchoc.py add -c <case_id> -i <item_id> -H <HandlerName> -o <OrganizationName>
        
Check out an item:
        python bchoc.py checkout -i <item_id> -H <HandlerName> -o <OrganizationName>

Check in an item:
        python bchoc.py checkin -i <item_id> -H <HandlerName> -o <OrganizationName>
      
Show all cases:
        python bchoc.py show cases

Show items in a case:
        python bchoc.py show items -c <case_id>

Show the history of an item:
        python bchoc.py show history -i <item_id>

Remove an item from a case:
        python bchoc.py remove -i <item_id> -r <reason> -o <owner_info>

Verify the integrity of the blockchain:
        python bchoc.py verify
        
Replace <case_id>, <item_id>, <HandlerName>, <OrganizationName>, <reason>, and <owner_info> with actual values for each command.

Additional Information
For additional commands and options, you can use the --help flag with the bchoc.py script to see more details on its usage




