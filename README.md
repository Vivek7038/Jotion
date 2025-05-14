> ⚠️ Note: The deployed version currently has authentication temporarily disabled due to backend issues. However, the full source code is available and can be run locally without issues. Please refer to the instructions below to set it up.

# Jotion

A versatile productivity platform mirroring Notion's intuitive design, offering seamless notes management and realtime update for individuals and teams .


## Demo 

https://notesphere-next.vercel.app/

Key Features:

- Real-time database  🔗 
- Notion-style editor 📝 
- Light and Dark mode 🌓
- Infinite children documents 🌲
- Trash can & soft delete 🗑️
- Authentication 🔐 
- File upload
- File deletion
- File replacement
- Expandable sidebar ➡️🔀⬅️
- Full mobile responsiveness 📱
- Fully collapsable sidebar ↕️
- Landing page 🛬
- Recover deleted files 🔄📄

### Prerequisites

**Node version 18.x.x**

### Cloning the repository

```shell
git clone https://github.com/Vivek7038/notesphere-next.git
```

### Install packages

```shell
npm i
```

### Setup .env file


```js
# Deployment used by `npx convex dev`
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

EDGE_STORE_ACCESS_KEY=
EDGE_STORE_SECRET_KEY=
```

### Setup Convex

```shell
npx convex dev

```

### Start the app

```shell
npm run dev
```
