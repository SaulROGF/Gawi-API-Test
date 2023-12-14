port=3000
token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imdpb3Zhbm55LmNoYXZlekBpbmdtdWx0aS5jb20iLCJpYXQiOjE2MzM0NTcwNjQsImV4cCI6MTY2NDk5MzA2NH0.Q5G1eVLPZZYf8BrJfjeD4ve5ZtWWwfSF1abVU17phEE"

businessName="IMTECH-G inc. :3"
rfc="CACG9401273Z8"
phone="6141106401"
email="giovanny.chavez@ingmulti.com"
city="Chihuahua"
state="Chihuahua"
zipCode="31137"
suburb="Los Arcos"
street="Arcos de Navarra"
addressNumber="419"

curl \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${token}" \
  --data "{
    \"businessName\":\"$businessName\",
    \"rfc\":\"$rfc\",
    \"phone\":\"$phone\",
    \"email\":\"$email\",
    \"city\":\"$city\",
    \"state\":\"$state\",
    \"zipCode\":\"$zipCode\",
    \"suburb\":\"$suburb\",
    \"street\":\"$street\",
    \"addressNumber\":\"$addressNumber\"
  }" \
  http://localhost:$port/clients/profile-data/update-billing-info




#curl -H "Content-Type: application/json" -H "Authorization: Bearer ${TOKEN}" \
#--data '{ "idBillingInformation":1, "idUser":20, "businessName":"Gio Enterprices", "rfc":"CACG9401273Z8", "phone":"6141909999", "email":"gio.icc.uach@email.com", "state":"1", "city":"1", "zipCode":"31137", "suburb":"Los Arcos", "street":"Arcos de Navarra", "addressNumber":"419", "facturapiClientToken":"" }' \
#http://localhost/clients/profile-data/update-billing-info
