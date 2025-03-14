# Steps to Execute

Use this curl to get access to the application as an admin

```c
curl --location 'http://localhost:3000/user/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "superadmin@admin.com",
    "password": "admin"
}'
```

## Types of Users
1. Admin
  
  This user can any operations in the application such as

  - Registering new user
  - CRUD of Document
  - Create and get details of an Ingestion

2. Editor

  This typeof user can perform any operation on the document

  - CRUD of Document
  - Create and Details of ingestion

3. Viewer

  This typeof user can perform any operation on the document

  - Details of ingestion
  - Read any document

## NOTE

The swagger document can be accessible under `http://localhost:3000/api`