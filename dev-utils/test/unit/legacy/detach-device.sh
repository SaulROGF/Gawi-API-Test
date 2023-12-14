port=3000
token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1aXNtaS5sdXVAZ21haWwuY29jIiwiaWF0IjoxNjM4Mjg3MzEyLCJleHAiOjE2Njk4MjMzMTJ9.eE0dZVBeyeWcFYgmqfPpywOvK_lDqb6QLGM4oKZ8-CI"
idDevice=181

curl \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${token}" \
  --data "{
    \"idDevice\":\"$idDevice\"
  }" \
  http://localhost:$port/clients/devices-data/detach-device