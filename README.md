
#  🛵 POS dashboard

>  *pt.riaujaya cemerlang suzuki - motorcycle service & sales management system*

  
![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black)  ![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat-square&logo=vite&logoColor=white)  ![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)  ![Supabase](https://img.shields.io/badge/-Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)

  

##  📋 overview

  

a modern, responsive web app built for motorcycle service shops to manage sales, inventory, and staff. Adaptable for similar businesses.

  

>  **_note:_**  *this is not an official app for pt.riaujaya cemerlang suzuki. it is a concept application inspired by the company.*

  

###  ✨ key features

  

- 📊 **dashboard**: visualize sales data, popular products, and recent transactions

- 💰 **point of sale (POS)**: process transactions quickly with real-time calculations

- 🧾 **receipts**: generate and print receipts

- 📝 **transaction history**: search and filter past sales with detailed views

- 📦 **inventory management**: track products with archive/restore functionality

- 👥 **team management**: manage sales staff and track performance

- 🌓 **dark/light mode**: comfortable viewing in any environment

- 🔒 **secure authentication**: role-based access with Supabase

  

##  🛠️ tech stack

  

- ⚛️ **React**: for building the user interface

- 🪄 **Vite**: for fast development and optimized builds

- 🎨 **Tailwind CSS**: for responsive, utility-first styling

- 🔐 **Supabase**: for authentication and database

- 📊 **MySQL**: backend database (server component)

- 📱 **responsive design**: works on desktop and mobile devices

  

##  🚀 getting started

  

###  prerequisites

  

- node.js (v16+)

- npm or yarn

- mysql database

  

###  installation

  

```bash

# clone the repo

git  clone  https://github.com/rywndr/riaujaya.git

  

# navigate to project directory

cd  riaujaya

  

# install client dependencies

cd  client

npm  install

  

# install server dependencies

cd  ../server

npm  install

```

  

###  configuration

  

create `.env` files in both client and server directories based on the examples:

  

**client/.env**

```

VITE_SUPABASE_URL=your_supabase_url

VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

VITE_API_URL=http://localhost:3000/api

```


**server/.env**

```

DB_HOST=localhost

DB_USER=root

DB_PASSWORD=your_password

DB_NAME=riaujaya

PORT=3000

```

###  running the app

  

```bash

# start the server

cd  server

npm  run  dev

  

# in another terminal, start the client

cd  client

npm  run  dev

```
  
visit `http://localhost:5173` in your browser

  

##  📱 screenshots

*[screenshots coming soon]*


##  🔍 features in detail
 

###  💼 management dashboard

- product inventory management with archiving

- sales team member management

- search and pagination for easy navigation

  

###  🧮 POS


- intuitive product search and cart management

- discount application at product level

- customer information capture

- detailed receipt generation

  

###  📜 transaction history

  

- comprehensive transaction logs

- filtering by date range and search terms

- expandable transaction details

- receipt viewing and printing


##  🤝 contributing

contributions are welcome! please feel free to submit a pull request.

##  📄 license

  
this project is licensed under the MIT License - see the LICENSE file for details.

---

💻 developed with ❤️ for pt.riaujaya cemerlang suzuki