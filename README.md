```
npm install
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
