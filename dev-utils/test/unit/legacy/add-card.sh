port=3000
token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imdpb3Zhbm55LmNoYXZlekBpbmdtdWx0aS5jb20iLCJpYXQiOjE2MzM0NTcwNjQsImV4cCI6MTY2NDk5MzA2NH0.Q5G1eVLPZZYf8BrJfjeD4ve5ZtWWwfSF1abVU17phEE"
conektaId="cus_2qcaf9Ff4eei2zLQ6"

# curl \
#   -H "Content-Type: application/json" \
#   -H "Authorization: Bearer ${token}" \
#   --data "{\"conektaId\":\"$conektaId\",\"cardToken\":\"tok_test_visa_4242\",\"isDefault\":\"false\"}" \
#   http://localhost:$port/clients/profile-data/add-card

curl \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${token}" \
  --data "{\"conektaId\":\"$conektaId\",\"cardToken\":\"tok_test_card_declined\",\"isDefault\":\"false\"}" \
  http://localhost:$port/clients/profile-data/add-card

# curl \
#   -H "Content-Type: application/json" \
#   -H "Authorization: Bearer ${token}" \
#   --data "{\"conektaId\":\"$conektaId\",\"cardToken\":\"tok_test_insufficient_funds\",\"isDefault\":\"true\"}" \
#   http://localhost:$port/clients/profile-data/add-card
# 
# curl \
#   -H "Content-Type: application/json" \
#   -H "Authorization: Bearer ${token}" \
#   --data "{\"conektaId\":\"$conektaId\",\"cardToken\":\"tok_test_msi_error\",\"isDefault\":\"true\"}" \
#   http://localhost:$port/clients/profile-data/add-card
# 
# curl \
#   -H "Content-Type: application/json" \
#   -H "Authorization: Bearer ${token}" \
#   --data "{\"conektaId\":\"$conektaId\",\"cardToken\":\"tok_test_amex_0005\",\"isDefault\":\"false\"}" \
#   http://localhost:$port/clients/profile-data/add-card
