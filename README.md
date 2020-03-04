# lambda-functions

# lambdaWithS3Node

This is the lambda function that triggers whenever a file is stored in the s3 bucket. It reads the JSON file and parses the data and send it to a REST API.

# callSSMWithS3Values

This is a STEP-1(step function) lambda function that runs a SSM command and returns the value to the STEP-2 (step function).

# getValuesFromStepFunctions

This is the STEP-2(step function) that gets the value from STEP-1(step function) and prints the value. 
