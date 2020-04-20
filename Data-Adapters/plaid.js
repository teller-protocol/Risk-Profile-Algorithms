'use strict';

const plaid                = require('../plaid');
const db                   = require('../db/web2');
const { encrypt, decrypt } = require('../encrypt-decrypt');
const findUserByWallet     = require('../utils/query-user');
const fetchTransactions    = require('../utils/fetch-transactions');
const errors               = require('../errors');

/**
 * @api {post} / savePlaidAccessToken
 * @apiVersion 1.0.0
 * @apiName savePlaidAccessToken
 * @apiGroup Plaid
 *
 * @apiParam {String} wallet wallet ID
 * @apiParam {String} publicToken Plaid public token
 *
 * @apiSuccess {Integer} message Message.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *      "jsonrpc": "2.0",
 *      "method":"savePlaidAccessToken",
 *       "id":1,
 *       "params":{
 *         "wallet": "WALLET_ID",
 *         "publicToken":"PLAID_PLUBIC_TOKEN"
 *        }
 *     }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *    {
 *      "jsonrpc": "2.0",
 *       "id": 1,
 *       "result": "Ok"
 *    }
 *
 * @apiExample {curl} Example usage:
 *     curl --location --request POST 'http://localhost:3003/' --header 'Content-Type: application/json' --data-raw '{"jsonrpc": "2.0", "method": "savePlaidAccessToken", "id":1, "params":{"wallet": "walletID", "publicToken":"PLAID_PUBLIC_TOKEN"}}'
 *
 * @apiUse InvalidMethodError
 *
 * @apiUse InvalidRequestError
 */
async function savePlaidAccessToken({ wallet, publicToken }) {
  try {
    // We dont actually need the user but we want to make sure they exist.
    await findUserByWallet(wallet);

    const accessToken = await plaid.authenticate(publicToken);
    const ciphertext  = encrypt(accessToken);

    // Save encrypted token.
    await db('users')
      .where({ wallet })
      .update({ plaid_access_token: ciphertext });

    return 'Ok';
  } catch (err) {
    console.error(err);
    throw errors.UnknownError;
  }
}

/**
 * @api {post} / getPlaidTransactions
 * @apiVersion 1.0.0
 * @apiName getPlaidTransactions
 * @apiGroup Plaid
 *
 * @apiParam {String} wallet wallet ID
 * @apiParam {String} account account ID
 *
 * @apiSuccess {Object} transactions Plaid transactions for last 60 days.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *    {
 *      "jsonrpc": "2.0",
 *       "id": 1,
 *       "result": []
 *    }
 *
 * @apiExample {curl} Example usage:
 *     curl --location --request POST 'http://localhost:3003/' --header 'Content-Type: application/json' --data-raw '{"jsonrpc": "2.0", "method": "getPlaidTransactions", "id":1, "params":{"wallet":"walletID","account": "accountID"}}'
 *
 * @apiUse InvalidMethodError
 *
 * @apiUse InvalidRequestError
 */
async function getPlaidTransactions({ wallet, account }) {
  try {
    if (!account || typeof account !== 'string') {
      throw 'Missing account parameter';
    }

    const user        = await findUserByWallet(wallet);
    const accessToken = decrypt(user.plaid_access_token);

    return await fetchTransactions(wallet, account, accessToken);
  } catch (err) {
    console.error(err);
    throw errors.UnknownError;
  }
}

/**
* @api {post} / getPlaidIncome
* @apiVersion 1.0.0
* @apiName getPlaidIncome
* @apiGroup Plaid
*
* @apiParam {String} wallet wallet ID
*
* @apiSuccess {Object} income Plaid user income.
*
* @apiExample {curl} Example usage:
*     curl --location --request POST 'http://localhost:3003/' --header 'Content-Type: application/json' --data-raw '{"jsonrpc": "2.0", "method": "getPlaidIncome", "id":1, "params":{"publicToken":"PLAID_PUBLIC_TOKEN"}}'
*
 * @apiUse InvalidMethodError
 *
 * @apiUse InvalidRequestError
*/
async function getPlaidIncome({ wallet }) {
  try {
    const user        = await findUserByWallet(wallet);
    const accessToken = decrypt(user.plaid_access_token);

    const { income } = await plaid.client.getIncome(accessToken);

    // Save transactions.
    await db('users')
      .where({ wallet })
      .update({ plaid_income: income });

    return income;
  } catch (err) {
    console.error(err);
    throw errors.UnknownError;
  }
}

module.exports = {
  savePlaidAccessToken,
  getPlaidTransactions,
  getPlaidIncome
};
