### Uppsetning
```
npm install
npx prisma generate
npm run dev
```

Create user
POST http://localhost:4000/api/auth/sign-up/email

json format:
{
"email": "admin@example.org",
"password": "Test12345678",
"name": "User One"
}

Sign in
POST http://localhost:4000/api/auth/sign-in/email

Admin login er 
```
{
"email": "admin@example.org",
"password": "admin12345"
}
```

Routes:
```
Events:

  Ná í alla events
  GET http://localhost:4000/events
  
  Ná í event eftir id
  GET http://localhost:4000/events/:id

  Búa til event
  POST http://localhost:4000/events

  Uppfæra event eftir id
  PUT http://localhost:4000/events/:id

  Eyða event eftir id
  DELETE http://localhost:4000/events/:id
  
Image:

  Ná í alla image
  GET http://localhost:4000/image

  Ná í image eftir id
  GET http://localhost:4000/image/:id

  Búa til image
  POST http://localhost:4000/image

  Uppfæra image eftir id
  PUT http://localhost:4000/image/:id

  Eyða image eftir id
  DELETE http://localhost:4000/image/:id
  
Media: 
  Ná í alla media
  GET http://localhost:4000/media

  Ná í media eftir id
  GET http://localhost:4000/media/:id

  Búa til media
  POST http://localhost:4000/media

  Uppfæra media eftir id
  PUT http://localhost:4000/media/:id

  Eyða media eftir id
  DELETE http://localhost:4000/media/:id
  
PLace:
  Ná í alla place
  GET http://localhost:4000/place

  Ná í place eftir id
  GET http://localhost:4000/place/:id

  Búa til place
  POST http://localhost:4000/place

  Uppfæra place eftir id
  PUT http://localhost:4000/place/:id

  Eyða place eftir id
  DELETE http://localhost:4000/place/:id
  
Ticket:

  Ná í alla ticket
  GET http://localhost:4000/ticket

  Ná í ticket eftir id
  GET http://localhost:4000/ticket/:id

  Búa til ticket
  POST http://localhost:4000/ticket

  Uppfæra ticket eftir id
  PUT http://localhost:4000/ticket/:id

  Eyða ticket eftir id
  DELETE http://localhost:4000/ticket/:id
  
User:

  Ná í alla user
  GET http://localhost:4000/user

  Ná í user eftir id
  GET http://localhost:4000/user/:id

  Búa til user
  POST http://localhost:4000/user

  Uppfæra user eftir id
  PUT http://localhost:4000/user/:id

  Eyða user eftir id
  DELETE http://localhost:4000/user/:id
```
### Hóp 4
Nöfn | Notendanofn
- Þóra Dís Garðarsdóttir| ThoraDis
- Valur Kristinn Starkaðarson | valurkristinn
- Dagur Ingi Viðar | DagurVidar
- Jóhann Chanse Sigurðsson | johannhawk

