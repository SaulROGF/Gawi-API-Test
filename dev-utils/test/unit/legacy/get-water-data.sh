port=3000
token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkRhbmllbGEubmF2YXJyb0BpbmdtdWx0aS5jb20iLCJpYXQiOjE2MzgzMDQ5MzcsImV4cCI6MTY2OTg0MDkzN30.I39I6P3aqKzwckNykxMbQmY8uN1ZkF5SxmoLEC3Ttew"
period=0
idDevice=161

curl \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${token}" \
  http://localhost:$port/clients/devices-data/get-water-device-alerts/$idDevice/$period