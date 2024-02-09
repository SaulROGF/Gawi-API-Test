#!/bin/bash

token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imdpb3Zhbm55LmNoYXZlekBpbmdtdWx0aS5jb20iLCJpYXQiOjE2NTAzMDU5NjcsImV4cCI6MTY1MDMwNjAyN30.8XLBg3zoX57u0b3Je8kQCWXBgHpGKLH89cqK3Jp5fto"
http --auth-type bearer --auth $token post http://localhost:3002/user/change-password user=gio name=vanny


# fake_token="eyJxxGciOiJIUzI1NiIsInyycCI6IkpXVCJ9.eyJlbWFpbCI6ImdpzzZhbm55LmNoYXZlekBpbmdtdWx0aS5jb20iLCJpYXQiOjE2NTAzMDEyOTUsImV4cCI6MTY1MDMwODQ5NX0.QM2skF5BbdESjSwpHtLola_c3zhiS4t0dwMN-zx-Ee4"
# http --auth-type bearer --auth $token post http://localhost:3002/user/change-password user=gio name=vanny




# # device data
# imei=864593050463123
# serialNumber=87654321
# 
# 
# # token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXJpYWxOdW1iZXIiOiI4NzY1NDMyMSIsImlhdCI6MTY0ODU4NDQ2NCwiZXhwIjoxNzExNjU2NDY0fQ.UTUmVNiCedRRi4vco7pnzrjosPGpgyNIzz6b4HIil4A"
# 
# # configurations data
# #settings=16383
# 
# # request login...
# request=$(http post http://api-test.gawi.mx/devs/login/ A=$imei B=$serialNumber)
# token=$(echo $request | jshon -e message | tr -d '"')
# # request marking configurations ...
# 
# settings="16351"
# http post http://api-test.gawi.mx/devs/wd-mark/ S=$settings T=$token
