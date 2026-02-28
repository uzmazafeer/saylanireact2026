# Firebase Setup – Saylani Mass IT Hub

Data store karne ke liye Firebase me ye steps follow karo.

---

## 1. Firebase project banao

1. [Firebase Console](https://console.firebase.google.com/) kholo.
2. **Add project** / **Create a project** pe click karo.
3. Project name do (e.g. `smit-portal`) → Next → Google Analytics optional → **Create project**.

---

## 2. Authentication (Email/Password) enable karo

1. Left sidebar me **Build** → **Authentication**.
2. **Get started** pe click karo.
3. **Sign-in method** tab me **Email/Password** pe click karo.
4. **Enable** karo → **Save**.

Isse login/signup kaam karega.

---

## 3. Firestore Database banao

1. Left sidebar me **Build** → **Firestore Database**.
2. **Create database** pe click karo.
3. **Start in test mode** choose karo (development ke liye) → Next.
4. Location choose karo (e.g. `asia-south1`) → **Enable**.

Baad me production ke liye rules update kar sakte ho.

---

## 4. Firestore Rules set karo (data save/read ke liye)

1. Firestore Database ke andar **Rules** tab pe jao.
2. Jo rules abhi hain wo **delete** karo.
3. Project me `firestore.rules` file me jo rules diye gaye hain wo **copy** karo.
4. Firebase Console me **paste** karo aur **Publish** karo.

Isse app wale collections (`lost_found_items`, `complaints`, `volunteers`) me data read/write ho paayega.

---

## 5. Web app config `src/firebase.js` me daalo

1. Firebase Console me **Project Overview** (gear icon) → **Project settings**.
2. Neeche **Your apps** me **Web** (</>) icon pe click karo.
3. App nickname do (e.g. `SMIT Portal`) → **Register app**.
4. Jo `firebaseConfig` object dikhe (apiKey, authDomain, projectId, …) use **copy** karo.
5. Apne project me **`src/firebase.js`** kholo.
6. `YOUR_API_KEY` wala placeholder **hatake** yahi copied config **paste** karo aur save karo.

Example:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc...",
}
```

---

## 6. (Optional) Authorized domains

Agar app **Vercel** ya kisi custom domain pe chal raha ho:

1. **Authentication** → **Settings** → **Authorized domains**.
2. **Add domain** me apna domain add karo (e.g. `saylanireact2026.vercel.app`).

---

## Summary

| Step | Kya karna hai |
|------|----------------|
| 1 | Firebase project banao |
| 2 | Authentication me Email/Password enable karo |
| 3 | Firestore Database create karo (test mode se start) |
| 4 | Firestore **Rules** me `firestore.rules` wale rules paste karke Publish karo |
| 5 | Web app config copy karke `src/firebase.js` me daalo |

In steps ke baad app me data store ho jayega (complaints, volunteers, lost & found).
