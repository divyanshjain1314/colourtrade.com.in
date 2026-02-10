This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


1. Game Rules & Logic (Backend Core)
Game har 30 seconds ya 1 minute ke period mein chalega.

Period ID: Har game ka ek unique ID hoga (e.g., 20240212001, 20240212002). Date + Number.

Timer: Reverse timer chalega (e.g., 60 seconds).

0-50 sec: Users bet laga sakte hain (Red, Green, Violet).

Last 10 sec: Betting close ("Lock" state). Result calculation hogi.

Betting Options:

Green: Agar result 1, 3, 7, 9 aata hai. (x2 Return)

Red: Agar result 2, 4, 6, 8 aata hai. (x2 Return)

Violet: Agar result 0 ya 5 aata hai. (x4.5 Return)

Number (0-9): Direct number prediction. (x9 Return)

2. Admin Control & Result Manipulation (Profit Logic)
Kyunki motive paisa kamana hai, toh result Random nahi hoga. Result Admin Algorithm se decide hoga.

Logic (Algorithm):
Jab betting close hone wali hoti hai (last 10 seconds), backend check karega:

Red par total bet kitni hai? (Maano ₹50,000)

Green par total bet kitni hai? (Maano ₹10,000)

Violet par kitni hai? (Maano ₹2,000)

Decision:
System wo colour/number winner banayega jispar sabse kam paisa laga hai taaki payout kam dena pade aur profit maximum ho.

Example: Agar Red pe zyada paisa hai, toh Green jeetega.

Manual Mode: Admin panel hona chahiye jahan admin khud decide kar sake ki agla result kya aana chahiye (manual override).

3. User Journey (Flow)
Login/Register: User account banayega.

Wallet Recharge:

Minimum Deposit: ₹1,000 (UPI/QR Code se).

Admin panel se approval milega, tab wallet mein paisa aayega.

Game Play:

User period dekhega, timer dekhega.

Colour select karega (Red/Green/Violet).

Amount select karega (Min bet ₹100).

Confirm karega -> Wallet se paisa deduct.

Waiting: Timer khatam hone ka wait karega.

Result:

Timer 00:00 par refresh hoga.

Agar jeeta -> Wallet mein paisa add (Winning Amount).

Agar haara -> Paisa gaya.

Withdrawal:

User withdraw request daalega.

Minimum balance ₹100 maintain rakhna zaroori hai.

Admin approve karega tab paisa user ke bank mein jayega.

4. Database Structure (MongoDB Schema Plan)
Hamein ye collections (tables) chahiye honge:

Users:

Name, Mobile, Password

WalletBalance (Important)

IsActive (Block karne ke liye)

Deposits:

UserID, Amount, UTR/TransactionID, Status (Pending/Approved/Rejected), Date.

Withdrawals:

UserID, Amount, BankDetails, Status, Date.

GameHistory (Periods):

PeriodID (Unique)

WinningNumber (0-9)

WinningColor (Red/Green/Violet)

TotalBetsRed, TotalBetsGreen... (Reporting ke liye)

Status (Completed)

Bets (Live Betting):

UserID, PeriodID

SelectedChoice (Red/Green/Number)

Amount

Status (Win/Loss/Pending)

Next Steps: Roadmap
Ab hamein step-by-step code karna chahiye:

Phase 1: Game Loop (Frontend + Backend Timer)

Ek hook banayenge jo server se sync hokar timer chalaye.

Last 10 seconds mein betting disable kare.

Automatic Period ID change ho.

Phase 2: Betting System

"Join Red/Green" button par click karne par popup khule.

Amount select karke API call ho.

Phase 3: Result Logic (Admin Side)

Backend logic jo kam investment wale side ko winner banaye.

Kya ham pehle "Game Timer aur Period ID" ka logic banayein? Kyunki wo is game ka dil (heart) hai.
