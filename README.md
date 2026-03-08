### Uppsetning
```
npm install
npm prisma generate
npm run dev
```

```
open http://localhost:3000
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
{
"email": "admin@example.org",
"password": "admin12345"
}

### Hóp 4
Nöfn | Notendanofn
- Þóra Dís Garðarsdóttir| ThoraDis
- Valur Kristinn Starkaðarson | valurkristinn
- Dagur Ingi Viðar | DagurVidar
- Jóhann Chanse Sigurðsson | johannhawk

