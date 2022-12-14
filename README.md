# Notes of Salem

[https://notes-of-salem.vercel.app/](https://notes-of-salem.vercel.app/)

Web application designed as all-in-one tool for ranked mode in [Town of Salem game](https://store.steampowered.com/app/334230/Town_of_Salem/) built with type-safe [React.js](https://reactjs.org/) (with [Next.js](https://nextjs.org/) and more using [T3 stack](https://github.com/t3-oss/create-t3-app)). Its features are highly opinionated by me, because I created it for myself.

## Features

This interactive ranked notepad includes:

- Tracking player claims and possible roles
- Tracking player townie-confirmation status
- Tracking player suspicion status
- Creating individual player notes and general game notes
- Tracking majority (how many town players currently alive vs how many evils alive)
- Automatic suspicion checking (multiple unique role claims, too many random town claims, etc.)
- Highlighting useful information (that Executioner's target can't be Jailor/Mayor and is confirmed townie, etc.)
- Improves visualization of your current game information

## How to use it

1. **Go to my website:** 
[https://notes-of-salem.vercel.app/](https://notes-of-salem.vercel.app/)

2. **When new game starts:**

- Click <code>New game</code> button. Select your role and all prompted player numbers. After filling new game form click <code>Confirm</code>.

3. **During the game:**

- Set player roles (based on claims and your information) by clicking <code>Set role</code> button in corresponding player rows 
- You can also select player faction/alignment (TI/TS/TP/TK/Mafia/..) if exact role isn't known
- If player is confirmed as townie, you can select <code>Confirmed town</code> checkbox
- If player is suspicious of being an evil, you can select <code>Suspicious</code> checkbox
- If player died - mark him as dead by clicking corresponding dead button with skull emoji
- You can write individual player notes (in player rows) and general game notes (bottom of the notepad)

**Use extra notepad features:**

- Check autosuspicion remarks (between <code>Suspicious</code> checkbox and player notes)
- Track majority of your faction in top-right corner
- You can clear role selection by clicking <code>Set role</code> -> <code>Clear</code>
- You can bring player back alive by clicking green heart button if you accidentally marked him as dead

## How to install it for dev purposes

- Clone this repo
- Run <code>npm install</code> to install node packages
- Run <code>npm run dev</code>

## Screenshots

![scr](https://i.imgur.com/WPN67vg.png)

![scr](https://i.imgur.com/V9pcbH1.png)

![scr](https://i.imgur.com/i4mDOUB.png)

## Upcoming features, bugfixes

- [Feature] Set personal website domain
