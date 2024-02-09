#!/bin/bash

# imei=864475044118692
# serialNumber=87654321

# port=3002
# imei=112233445566778
# serialNumber=27011994
# http post http://localhost:$port/devs/login/ A=$imei B=$serialNumber


imei=866425030223566
serialNumber=22446688

request=$(http post http://api-test.gawi.mx/devs/login/ A=$imei B=$serialNumber)
token=$(echo $request | jshon -e message | tr -d '"')
echo -e "\033[32m${token}"
