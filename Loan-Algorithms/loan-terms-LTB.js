'use strict';

const plaid             = require('../plaid');
const { decrypt }       = require('../encrypt-decrypt');
const fetchTransactions = require('../utils/fetch-transactions');
const findUserByWallet  = require('../utils/query-user');
import loanToBalance from "../Risk-Parameters/loan-to-balance.js"

/**
 * @api {post} / getLoanTerms
 * @apiVersion 1.0.0
 * @apiName getLoanTerms
 * @apiGroup Base
 *
 * @apiSuccess {json} Collateral percent, IR, and max loan.
 *
 * @apiParam {Object} params Parameters
 *
 * @apiParamExample {json} Request-Example:
 * {"jsonrpc": "2.0", "method": "getLoanTerms", "id":1, "params":{"loanSize":
 * 500,"account":"account ID","wallet":"wallet ID"}}
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *    {
 *      "jsonrpc": "2.0",
 *       "id": 1,
 *       "result": {
 *          "collateralPercent": 65,
 *          "ir": 35,
 *          "maxLoan": 300
 *       }
 *    }
 * @apiExample {curl} Example usage:
 *     curl --location --request POST 'http://localhost:3003/' --header 'Content-Type: application/json' --data-raw '{"jsonrpc": "2.0", "method": "getLoanTerms", "id":1, "params":{"collateralPercent": 65,"ir": 35,"maxLoan": 300}
}'
 *
 * @apiUse InvalidMethodError
 *
 * @apiUse InvalidRequestError
 */
async function getLoanTerms({ loanSize, account, wallet }) {
  try {
    const MAX_LOAN = 100; // DAI
    const MIN_IR   = 0.08;
    const MAX_IR   = 0.24;

    const collateralProvided = await loanToBalance(wallet, account);

    // 135% - (collateral provided - loan size)
    const collateralPercent = 1.35 - (collateralProvided / loanSize);

    // Inverse of collateralPercent
    let ir = 1.0 - collateralPercent;

    ir = ir < MIN_IR ? MIN_IR : (ir > MAX_IR ? MAX_IR : ir);

    return {
      collateralPercent: collateralPercent.toFixed(2),
      ir: ir.toFixed(2),
      maxLoan: MAX_LOAN
    };
  } catch (err) {
    console.error(err);
    throw plaid.onError(err);
  }
}

module.exports = { getLoanTerms };
