
port=3000
token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imdpb3Zhbm55LmNoYXZlekBpbmdtdWx0aS5jb20iLCJpYXQiOjE2MzM0NTcwNjQsImV4cCI6MTY2NDk5MzA2NH0.Q5G1eVLPZZYf8BrJfjeD4ve5ZtWWwfSF1abVU17phEE"

firstName="Giovanny Alfonso"
lastName="Chávez"
mothersLastName="Ceniceros"
phone="6141909999"
email="giovanny.chavez@ingmulti.com"
zipCode="31137"
suburb="Los Arcos"
street="Arcos de Navarra"
addressNumber="419"


curl \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${token}" \
  --data "{
    \"firstName\":\"$firstName\",
    \"lastName\":\"$lastName\",
    \"mothersLastName\":\"$mothersLastName\",
    \"phone\":\"$phone\",
    \"email\":\"$email\",
    \"zipCode\":\"$zipCode\",
    \"suburb\":\"$suburb\",
    \"street\":\"$street\",
    \"addressNumber\":\"$addressNumber\"
  }" \
  http://localhost:$port/clients/profile-data/update-client-account-data

