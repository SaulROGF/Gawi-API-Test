TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imdpby5pY2MudWFjaEBnbWFpbC5jb20iLCJpYXQiOjE2MzA1MTA5NzIsImV4cCI6MTY2MjA0Njk3Mn0.AoYPDvWWs6KKG5XAc5bn8xWzFKFYk7S2g0TYPXUzoTs"
ID=158
curl -H "Content-Type: application/json" -H "Authorization: Bearer ${TOKEN}" \
http://localhost/clients/devices-data/get-water-device-settings/${ID}/
