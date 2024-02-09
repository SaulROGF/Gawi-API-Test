#!/bin/bash
email=almacen@ingmulti.com
password=ingmulti

resp=$(http post http://api-test.gawi.mx/auth/login/ email=$email password=$password)
tokenResp=$(echo $resp | jshon -e data | grep token | tr -d ' ' | tr -d '"'| tr -d ',') 
token=${tokenResp:6}

echo -e "\033[32m${token}"


