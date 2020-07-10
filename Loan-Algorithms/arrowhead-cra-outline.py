def retrieveGlobalSettings():
	# GET request to The Graph for all global setting vars
​
	# Example setting variables
​
	# supply-to-debt
	# max loan size
	# liquidity buffer
	# risk premium interest rate
​
	return {"SETTING-VARS"}
​
def loanToBalance(bankInfo)
	# From bank transactions, calculate lowest bank bal in past 60 days
	return {"LTB"}
​
def cTokenInterestRate(asset)
	# retrieve the supply rate from the cToken from The Graph
	return supplyRate
​
def loanRiskAssessment(requestedLoanSize, loanUse, bankInfo, collateralPercentEntered, borrowedAsset, ethereumWallet):
	
	#GLOBAL variables we look to calculate throughout the function
​
	#minimum collateral needed to borrow loan
	minimum_collateral = 150 
​
	#collateral percent that will be returned to the borrower
	collateral_percent = 150
​
	#bool if bank is connected or not
	bank_connected = False
​
	#multiplier to decrease interest rate premium from data connected
	interest_rate_premium_multiplier = 1
​
	#sets the interest rate cap by the state
	state_interest_rate_cap = False
​
	#size of a loan based on info entered
	loan_size = 100
​
	#final interest rate to be returned from the request
	final_interest_rate = 100
​
	# retrieve global settings from on-chain
	settings = retrieveGlobalSettings()
​
	if requestedLoanSize > settings["maxLoanSize"]:
		loan_size = settings["maxLoanSize"]
	else:
		loan_size = requestedLoanSize
​
	if bankInfo != {}:
		bank_connected = True
​
		# since bank is connected, the minimum collateral could be 0% (if the loan type is not VARIABLE)
		minimum_collateral = 0
​
		# segment location, check if borrower in USA
		country = bankInfo["location"]["country"]
		
		# if borrower in USA, check which state
		if country == "USA":
			state = bankInfo["location"]["country"]["state"]
​
			# retrieve state cap from JSON
			state_cap = state_cap_json[state] 
​
			# set the global state interest rate cap, if the state has a capped interest rate
			if state_cap != False:
				state_interest_rate_cap = state_cap
​
				#set the loan size, based on the state cap
				# loan_size = $100 * state_interest_rate_cap
				loan_size = 100 * state_interest_rate_cap
​
	# VARIBLE means the underlying asset can be switched for another asset
	if loanUse == "VARIBALE":
		liquidity_buffer = settings["liquidity_buffer"]
		risk_premium_ir = settings["risk_premium_ir"]
​
		# since the underlying asset can be changed, we will need to liquidate. Thus, the min collateral is the liquidity buffer + the risk permium interest rate
		minimum_collateral = liquidity_buffer + risk_premium_ir
​
	# FIXED means the underlying asset remains the same when used by the borrower
	if loanUse == "FIXED":
		if bank_connected == False:
			liquidity_buffer = settings["liquidity_buffer"]
			risk_premium_ir = settings["risk_premium_ir"]
​
			# since the underlying asset can be changed, we will need to liquidate. Thus, the min collateral is the liquidity buffer + the risk permium interest rate
			minimum_collateral = liquidity_buffer + risk_premium_ir
​
	# when the minimum collateral is greater than that entered by the borrower, we must update the borrower with how much collateral to provide
	if minimum_collateral > collateralPercentEntered:
		collateral_percent = minimum_collateral
​
	# calculate loan-to-balance and use in IR multiplier formula
	if bank_connected:
		LTB = loanToBalance()
		interest_rate_premium_multiplier *= (1 - (0.5 * (LTB/loan_size)))
​
	# integrate the diminished interest rate premium from collateral provided
	interest_rate_premium_multiplier *= (-2/3)*collateral_percent + 1
​
	if state_interest_rate_cap == False:
		final_interest_rate = state_interest_rate_cap - 1
	else:
		final_interest_rate = cTokenInterestRate(asset) + (settings["risk_premium_ir"] * interest_rate_premium_multiplier)
​
    # return variables for the borrower
    return_vars = {"interest_rate":final_interest_rate, "collateral_percent":collateral_percent, "loan_size":loan_size}
	
	# ETH web3 sign message for return values
	signedMessage = sign(return_vars, ethereumWallet)
​
    return signedMessage
​
