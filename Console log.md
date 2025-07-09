# How to use this file
- Whenever a new request is made via CoPilot code chat, read this file and check if the text under the dashed line contains a 'X:' or 'Y:' leading parameter. This variable is an indicator that the user has shared their console log due to the existance of an error after publishing the code to their environment.

1. the message starts with X:
Read all of the text that comes after 'X:' including if the the text starts on a new line. Read it from top until bottom and search for the file mentioned in the error. Fix the error. After fixing the error, update the 'X:' to 'Y:'.

2. the message starts with Y:
This means you have already updated the code to handle the error and the user has not set a new console error message. Disregard whatever comes after 'Y:'
--------------------------------------------------------------------------------------------------------
Y: Verlofrooster.aspx:2553  Uncaught SyntaxError: missing ) after argument list (at Verlofrooster.aspx:2553:21)