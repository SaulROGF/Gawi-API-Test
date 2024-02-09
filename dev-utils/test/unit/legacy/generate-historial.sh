#!/bin/bash

# device data
port=3002

imei=864475044118692
serialNumber=87654321
# imei=112233445566778
# serialNumber=27011994

temperature=20    # ± 5
signalQuality=29  # ± 2
batteryLevel=50   # ± 15 

# request login ...
request=$(http post http://api-test.gawi.mx/devs/login/ A=$imei B=$serialNumber)
token=$(echo $request | jshon -e message | tr -d '"')

while true
do
    A=123 # consumption
    B=$(echo "import random; print('%.2f' % random.random())" | python3) # flow
    C=$(echo "import random; print(${temperature} + random.randint(-5, 5))" | python3)   # temperature
    D=$(echo "import random; print(${signalQuality} + random.randint(-2, 2))" | python3) # signalQuality
    E=$(echo "import random; print(${batteryLevel} + random.randint(-15, 15))" | python3) # bateryLevel
    F=63 # alerts
    G=1  # reason
    H="22/$(date +'%m/%d')" # deviceDate
    I=$(date +'%H:%M:%S') # deviceTime
    J=$(echo "import random; print('%.2f' % random.random())" | python3) # inverseConsumption

    echo -e "\033[92m$A $B $C $D $E $F $G $H $I $J"
    # request save history ...
    http post http://api-test.gawi.mx/devs/wd-save/ \
    A=$A B=$B C=$C D=$D E=$E F=$F G=$G H=$H I=$I J=$J "Authorization: Bearer $token"
    sleep 30
done
