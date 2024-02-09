
port=3000
token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imdpb3Zhbm55LmNoYXZlekBpbmdtdWx0aS5jb20iLCJpYXQiOjE2MzM0NTcwNjQsImV4cCI6MTY2NDk5MzA2NH0.Q5G1eVLPZZYf8BrJfjeD4ve5ZtWWwfSF1abVU17phEE"

curl \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${token}" \
  http://localhost:$port/clients/profile-data/get-billing-info
