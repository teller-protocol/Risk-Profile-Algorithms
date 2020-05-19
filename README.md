# Zero Collateral (ZC) Overview 
Zero Collateral is an unsecured, decentralized lending protocol, interoperable with centralized financial data. 

# Risk Profile Algorithms 🔢
In efforts to build an open credit network, community members are encouraged to deploy their own risk models, and can be rewarded when their algorithms lead to successful loan repayments.

These risk assessment models are open-source and transparent to the borrower. Each algorithm may be general in nature, or specific to a variety of opt-in data sources, including FICO scores and credit history, assets and income, education, and community status and participation.  

Through the protocol, lenders stake to the most optimal algorithms, enabling a continuous improvement in risk management and more accurate, open assessment of credit worthiness.


# ZC Open-Source Risk Management 🔐

Today’s major lending institutions determine credit worthiness through a nontransparent and subjective assessment process. The use of qualitative borrower criteria, such as customer interviews, introduce discriminatory bias and the potential for human error.

We, as a decentralized community, aim to level the financial playing field. Through open-source risk management systems, we can not only remove censorship, borders, and discrimination from the borrowing process, but also foster a transparent credit process. Open access to credit scores, based on digital data, will feed a continuously evolving credit risk-model, in aim to determine the most honest and accurate assessment of creditworthiness.


# ZC Risk Model Architecture ⛓
The open source risk management network can be divided into three technical components; **data adapters, risk parameters, and loan algorithms**. 

Loan terms - **max loan size, interest rate, and collateral % needed** - are the resultant output of loan algorithms.

![](/images/diagrams/credit-risk-flow-model.png)

**Component Folders**. Each component has it’s own folder in the Github repository. You can directly access them here:

Data Adapters - [Folder](/Data-Adapters)  
Risk Parameters - [Folder](/Risk-Parameters)  
Loan Algorithms - [Folder](/Loan-Algorithms)  

**Code Languages**. The node network is language agnostic, however it will initially support risk model components written in nodejs and python. 

**How to Deploy**. To deploy a new technical component or edit the current architecture, simply create a PR in the component’s respective directory. 

**Protocol Rewards**. In order to qualify for protocol rewards, you must link your Ethereum wallet address to your code commits. This can be done as a comment in the PR. We are exploring a more privacy preserving feature for future use.

**Distributed Cloud**. Once a PR is merged, the code is automatically deployed into the CI/CD pipeline of the network’s distributed cloud. You can read more about the network’s cloud architecture [here](https://stratosphere-whitepaper.s3-us-west-1.amazonaws.com/Stratosphere_+Distributed+Cloud+Network+for+Decentralized+Application+Scalability.pdf).


# ZC Developer Community Opportunities 🎊

## Data Adapters
### **[Data-Adapters](/Data-Adapters)** are connections to third party data sources, processed through API gateways or other supported data transportation methods.

**Provided by team. View [docs](http://web2-elb-ntwrk-94efa0b9d1e72695.elb.us-west-2.amazonaws.com/docs/).**
- FICO  
- Plaid  

For community build out. This is a non-exhaustive list. If you have other data adaptors you'd like to connect, please added them!

**Work / Income**  
- UpWork  
- Shopify  
- Workday  
- Gusto  
- Intuit  
- Freelancer  
- Fiverr  

**Spending / Payments**  
- Venmo  
- Paypal  
- Utility bills  
- Honey  
- Loli  

**Social / Community**  
- Github  
- Twitter  
- YouTube  

**Liabilities**  
- Debt obligations   

**Assets**  
- Stock holdings  
- Crypto holdings  

**Education**  
- University email verification  

## Risk Parameters
### **[Risk-Parameters](/Risk-Parameters)** aggregate input from data-adapters and calculate specific credit risk variables.

This is a non-exhaustive list of example risk-parameters. The data is to be compiled from the Data-adapters (above). Please create and add your own!

**Debt-to-Income Ratio**  
- Compile all debt assets  
- Compile all income  
- DTI = debt / income  

**Bill-to-Payment Ratio**  
- Time between Bill issued and Payment Complete (in seconds)  
- TimeDelta = Payment(t1)-Bill(t0)  
- BTP = SUM(BillAmount * TimeDelta) / SUM(BillAmounts)

**Credit Utilization Ratio**  
- Total credit limits available  
- Total credit balance  
- CUR = Balance / Limits  

**Github-Activity Score**  
- Score 0-10 based on  
  - Number of contributions / 12 months   
  - Stars / repo contributed  
  - Number of repos contributed to  
- GAS = 
  - MIN([AVG(# Contributions per month for past 12 months)], 10) +  
  - MIN([AVG(# Repos contributed per month for past 12 months)], 10) +  
  - Popularity score = SUM(Repo contributed stars) applied to [10 —> 2, 100 —> 4, 1k —> 6, 10k —> 8, 100k —> 10 ] 
  - DIVIDE sum of scores by 30 
 
## Loan Algorithms
### **[Loan-Algorithms](/Loan-Algorithms)** calculate a credit report on the aforementioned risk parameters, and perform a credit analysis on the resulting report. The credit analysis is used to predict the probability of a default by the given borrower.

You are free to create your own risk algorithms. Feel free to incorporate the built risk parameters, or add your own to the mix. The core ZC team will also release the initial basic algorithms, based on the following criteria:

**Capacity**. The ability to repay the loan based on the proposed amount and terms.  
For example, a higher DTI equates to lower ability to repay, thus a higher chance of default. Without an associated FICO score, we may limit the DTI to 5%.

**Conditions**. Any factor specific to the loan itself, borrower's info, or macro-economic events.  
For example, If the borrower connects their FICO info, we may drop collateral requirements to 0%.

**Collateral**. Assets pledged by a borrower as security for a loan.  
For example, if an asset is to be held in escrow, we may be able to increase max loan size up to 1000%.

**Character**. The borrower's reputation or record.
For example, the Github-Activity Score may lower the interest rate of the borrower, down to 10% less.

### Output from the loan algorithms will be the borrower's resulting loan terms. 
**Max Loan Size**.  The maximum amount that can be borrowed by the borrower at any point in time.  
**Interest Rate**.  The yearly interest associated with loans issued to the borrower.  
**Collateral % Needed**.  The collateral percentage (worth in ETH) based on the loan size.  

# ZC Developer Rewards 🏺
Developer rewards are built directly into the Zero Collateral protocol, delivered on successful loan repayment.

![](/images/diagrams/developer-rewards-model.png)

The diagram above shows the process by which risk profile algorithms are utilized throughout the lending process. Lenders kick off the system by staking to the risk profiles they desire (2). Borrower credit info is processed through these risk algorithms to determine loan terms. After successful loan repayment, the borrower network incurs a repayment fee (3). Specific proportion of the repayment fee is to be converted into developer rewards (4).  

Rewards will be sent to the Ethereum address(es) associated with a risk profile algorithm. Since each algorithm is managed by the community, multiple developers can be attributed to a specific one algorithm. 

# Become a ZC Pioneer 🚀
Join us in building the next generation of open-source, decentralized credit and lending. As part of the first cohort of the Zero Collateral development community, you'll have first-mover advantage on reward opportunities and governance power to decide which proposals to reward.  

By joining now, you’ll earn the:  

Nomination to write Zero Collateral’s open-source risk profile algorithms. When your algorithms are used in the borrower’s loan origination process, you’ll receive reward fees from successful loan repayments.

Support to become an active Governor in the ZeroCollateral Community DAO.
- Voting power on core protocol decisions.
- Early leadership on protocol development.
- Influence the direction of dev community funds.

Power to propose the initial cohort of Zero Collateral RFP's.

Come build the future of decentralized finance, and make your mark in creating a more transparent, open credit network. 
