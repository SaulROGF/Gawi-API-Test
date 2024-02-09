TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imdpby5pY2MudWFjaEBnbWFpbC5jb20iLCJpYXQiOjE2MjkzMDM3NDAsImV4cCI6MTY2MDgzOTc0MH0.d9C2zRr1lDuQVYVO7yI2017AR0zpz0_wvNNie3EbbP8"

curl -H "Content-Type: application/json" -H "Authorization: Bearer ${TOKEN}" \
--data '{ "idTown": 6 }' \
http://localhost/clients/update-town
