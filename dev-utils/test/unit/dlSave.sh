#!/bin/bash
imei=112233445566778
serialNumber=27011994

# - - - - - - - - - - - - - - - - - - - - - - - - - #
#            4 entradas digitales                   #
#            4 entradas analógicas                  #
#            2 contadores de flujo                  #
#            2 contadores de consumo                #
#                                                   #
#            nivel de batería (?)                   #
#            calidad de señal (?)                   #
#            tiempo del dispositivo (?)             #
# - - - - - - - - - - - - - - - - - - - - - - - - - #

# port=3002
# request=$(http post http://localhost:3002/devs/login/ A=$imei B=$serialNumber)
# token=$(echo $request | jshon -e message | tr -d '"')
# http post http://localhost:3002/devs/dl-save/ T=$token


request=$(http post http://api-test.gawi.mx/devs/login/ A=$imei B=$serialNumber)
token=$(echo $request | jshon -e message | tr -d '"')
http post http://api-test.gawi.mx/devs/dl-save/ T=$token
