#!/bin/bash

# # instance a fake token
# fake_token=eyJhbGciOiJIUzI1NiIsInR5cCIxxxpXVCJ9.eyJzZXJpYWxOdWxxxXIiOiIyNzAxMTk5NCIsImlhdCI6MTY0NTU1ODcyNywiZXhwIjoxNzA4NjMwNzI3fQ.TLKTCKEQM2vLNFxUOpepLJFwb5KILyBXnpX6wd6Nxxx 
# 
# # device data
# port=3002
# imei=86459305463123
# serialNumber=87654321
# 
# # configurations data
# settings=16383
# 
# # request login...
# request=$(http post http://localhost:$port/devs/login/ A=$imei B=$serialNumber)
# token=$(echo $request | jshon -e message | tr -d '"')
# # request marking configurations ...
# http post http://localhost:$port/devs/wd-mark/ T=$token S=$settings


# /* *********************************************************************** */


# device data
imei=864593050463123
serialNumber=87654321

# configurations data
#settings=16383

# request login...
#request=$(http post http://api-test.gawi.mx/devs/login/ A=$imei B=$serialNumber)
#token=$(echo $request | jshon -e message | tr -d '"')
# request marking configurations ...

settings="16383"
# token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXJpYWxOdW1iZXIiOiI4NzY1NDMyMSIsImlhdCI6MTY0ODU4NDQ2NCwiZXhwIjoxNzExNjU2NDY0fQ.UTUmVNiCedRRi4vco7pnzrjosPGpgyNIzz6b4HIil4A"
token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imdpb3Zhbm55LmNoYXZlekBpbmdtdWx0aS5jb20iLCJpYXQiOjE2NTAyOTM3NDYsImV4cCI6MTY1MDM0Nzc0Nn0.vhDpHpE0BUuigEiZJ7qvAWnXY31qmKav5E2EL75-gkM"   



http post http://localhost:3002/devs/wd-mark/ T=$token S=$settings
# http post http://api-test.gawi.mx/devs/wd-mark/ S=$settings T=$token
