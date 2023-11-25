# Set the path to your Truffle project
$TRUFFLE_PROJECT_PATH = "C:\Users\ASUS\Dropbox (ASU)\MS ASU\CSE 469 CNF\GROUP PROJECT\kuchbi\blockchain_chain_of_custody\chain_of_custody"

# Set the path to the Truffle executable
$TRUFFLE_EXECUTABLE = "truffle"

# Change to the Truffle project directory
cd $TRUFFLE_PROJECT_PATH

# Parse the command
$command = $args[0]
$scriptArgs = $args[1..($args.Length-1)]

switch ($command) {
    "addEvidenceItem" {
        & $TRUFFLE_EXECUTABLE exec scripts/addEvidenceItem.js $scriptArgs
    }
    "checkout" {
        & $TRUFFLE_EXECUTABLE exec scripts/checkout.js $scriptArgs
    }
    "checkin" {
        & $TRUFFLE_EXECUTABLE exec scripts/checkin.js $scriptArgs
    }
    "show" {
        $subCommand = $scriptArgs[0]
        $subArgs = $scriptArgs[1..($scriptArgs.Length-1)]
        switch ($subCommand) {
            "cases" {
                & $TRUFFLE_EXECUTABLE exec scripts/showCases.js $subArgs
            }
            "items" {
                & $TRUFFLE_EXECUTABLE exec scripts/showItems.js $subArgs
            }
            "history" {
                & $TRUFFLE_EXECUTABLE exec scripts/showHistory.js $subArgs
            }
            default {
                Write-Host "Invalid show command. Use 'cases', 'items', or 'history'."
            }
        }
    }
    "remove" {
        & $TRUFFLE_EXECUTABLE exec scripts/remove.js $scriptArgs
    }
    "init" {
        & $TRUFFLE_EXECUTABLE init
    }
    "verify" {
        & $TRUFFLE_EXECUTABLE run verify
    }
    "develop" {
        & $TRUFFLE_EXECUTABLE develop
    }
    "retrieveData" {
        & $TRUFFLE_EXECUTABLE exec scripts/retrieveData.js $scriptArgs
    }
    default {
        Write-Host "Invalid command. Supported commands: addEvidenceItem, checkout, checkin, show, remove, init, verify, develop, retrieveData."
    }
}
