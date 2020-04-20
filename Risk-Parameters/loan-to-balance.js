'use strict';

const plaid             = require('../plaid');
const { decrypt }       = require('../encrypt-decrypt');
const fetchTransactions = require('../utils/fetch-transactions');
const findUserByWallet  = require('../utils/query-user');

async function loanToBalance(wallet, accountId) {
  // percent of balance to allow as collateral
  const COLLATERAL_PERCENT = 0.2;

  const user        = await findUserByWallet(wallet);
  const accessToken = decrypt(user.plaid_access_token);

  // Fetch account
  const opts    = { account_ids: accountId };
  const account = await plaid.client.getBalance(accessToken, opts);

  // Fetch and save latest txns to ensure they're up-to-date
  // positive transaction amounts = money leaving account,
  // negative transaction amounts = money entering account
  // Source: https://plaid.com/docs/#transactions
  const txns = await fetchTransactions({ wallet, account });

  let lowestBalance = account.balances.available;
  let calculated    = lowestBalance;

  // Working backwards from the current balance.
  // Iterate through previous txns,
  // If money left the account, add it back in,
  // if money entered the account, remove it.
  for (const txn of txns) {
    calculated += txn.amount;
    lowestBalance = Math.min(calculated, lowestBalance);
  }

  return lowestBalance * COLLATERAL_PERCENT;
}
