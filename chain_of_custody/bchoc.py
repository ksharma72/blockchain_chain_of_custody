#!/usr/bin/env python3
import argparse
import subprocess
import sys
import os

SCRIPTS_PATH = "./scripts"

def add_evidence(case_id, item_ids, handler, organization):
    """
    Calls the addEvidenceItem.js script to add new evidence items to the blockchain.
    """
    try:
        item_ids_str = ",".join(item_ids)  # Convert list of item IDs to a comma-separated string
        command = ["node", f"{SCRIPTS_PATH}/addEvidenceItem.js", case_id, item_ids_str, handler, organization]
        #print("Executing command:", ' '.join(command))  # Debug: print the command
        result = subprocess.run(command, capture_output=True, text=True, check=True, bufsize=1)
        print(result.stdout)
        #print("Standard Error:", result.stderr)  # Print stderr regardless of error
    except subprocess.CalledProcessError as e:
        print(f"Error during adding evidence: {e.stderr}", file=sys.stderr)
        sys.exit(e.returncode)


def checkout_evidence_item(item_id, handler, organization):
    """
    Calls the checkoutEvidenceItem.js script to checkout an evidence item from the blockchain.
    """
    try:
        result = subprocess.run(
            ["node", f"{SCRIPTS_PATH}/checkoutItem.js", item_id, handler, organization],
            capture_output=True, text=True, check=True
        )
        if result.stdout:
            print(result.stdout)  # Only print standard output if it's not empty
        if result.stderr:
            print(f"Error during checkout: {result.stderr}", file=sys.stderr)  # Print standard error if it's not empty
    except subprocess.CalledProcessError as e:
        print(f"Error during checkout: {e.stderr}", file=sys.stderr)
        sys.exit(e.returncode)


# Argument parser setup
parser = argparse.ArgumentParser(description="Blockchain Chain of Custody Management Tool")
subparsers = parser.add_subparsers(dest="command")

# Add command parser
add_parser = subparsers.add_parser('add', help='Add an evidence item to a case')
add_parser.add_argument('-c', '--case_id', required=True, help='Case ID')
add_parser.add_argument('-i', '--item_id', action='append', required=True, help='Item ID')
add_parser.add_argument('-H', '--handler', required=True, help='Handler')  # Changed to -H
add_parser.add_argument('-o', '--organization', required=True, help='Organization')

# Checkout command parser
checkout_parser = subparsers.add_parser('checkout', help='Checkout an evidence item')
checkout_parser.add_argument('-i', '--item_id', required=True, help='Item ID')
checkout_parser.add_argument('-H', '--handler', required=True, help='Handler')  # Changed to -H
checkout_parser.add_argument('-o', '--organization', required=True, help='Organization')

def main():
    args = parser.parse_args()

    if args.command == 'add':
        add_evidence(args.case_id, args.item_id, args.handler, args.organization)
    elif args.command == 'checkout':
        checkout_evidence_item(args.item_id, args.handler, args.organization)
    # ... handle other commands

if __name__ == '__main__':
    main()
