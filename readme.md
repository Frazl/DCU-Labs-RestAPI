# API Supports the following calls

All calls return JSON, all calls are updated every ten minutes and contain a lastUpdate to inform you when it was last updated. 

Feel free to test the API calls on the test heroku deployment, here ['https://dculabs.herokuapp.com/api/v1/'].
### /api/v1/labs/max

Returns the longest available lab within the school of computing. This is useful when you want to get some study done and not kicked out of labs because there's exams on etc..

You can pass the query exclude with labs you want to exclude. 

Example usage:
- /api/v1/labs/max?exclude=LG27,L101
- /api/v1/labs/max

## /api/v1/room?room=

Pass it a room out of the available rooms the program supports and it will tell you all the information about it for the day. 

Example usage:

- /api/v1/room?room=CG12
- /api/v1/room?room=LG25

## /api/v1/rooms

Returns all information about every single room. 

Example usage:

- /api/v1/rooms


## What's coming? 

- Support for rooms in engineering, nursing and science. 
- Support for other days not just the current day. 

Want more features added? Leave an issue :) 
