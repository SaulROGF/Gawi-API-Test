#!/bin/bash
email=almacen@ingmulti.com
password=ingmulti
resp=$(http post http://api-test.gawi.mx/auth/login/ email=$email password=$password)
tokenResp=$(echo $resp | jshon -e data | grep token | tr -d ' ' | tr -d '"' | tr -d ',') 
token=${tokenResp:6}

imei=123456789098765
idApn=1 # ott.iot.attmex.mx
serialNumber=19940127
type=1
boardVersion=1

http -A bearer -a $token post http://api-test.gawi.mx/wharehouse-devices-admin/create-device \
imei=$imei idApn=$idApn serialNumber=$serialNumber type=$type boardVersion=$boardVersion