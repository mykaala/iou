# iou

**iou** is a simple group expense tracker for friends on trips, hangouts, or shared events. Instead of splitting every bill in real time, just log who paid what — and let the app calculate who owes who by the end.

---

## ✨ Features

- 🔐 **Google Login** – Sign in securely with your Google account  
- 🧑‍🤝‍🧑 **Create & Join Groups** – One place to track expenses per trip/event  
- 💸 **Add Expenses** – Record who paid, how much, and for what  
- 📊 **Simplified Settlements** – Automatically calculates minimal number of paybacks  
- 📱 **Mobile-Responsive UI** – Works cleanly on phones and desktops  

---

## 🚀 Tech Stack

| Layer        | Tech                          |
|--------------|-------------------------------|
| Frontend     | HTML/CSS, JavaScript (React) |
| Backend      | Node.js, Express              |
| Auth         | Google OAuth (Passport.js)    |
| Database     | MongoDB (Mongoose)            |
| Deployment   | Vercel + MongoDB Atlas |

---

## 🧠 How It Works

1. **User signs in with Google Account**
2. **Joins or creates a group trip**
3. **Adds expenses** like: “I paid $60 for dinner for Josh, Kate, and Archie”
4. App **stores each transaction** and runs a debt simplifier algorithm
5. View final balances: who owes who and how much
