//////////////////////////////////////////////////////////////

This project integrates three NASA API endpoints:

1) APOD (Astronomy Picture of the Day) – browse today’s image and navigate to previous posts.
2) Mars Rovers – view photos from Mars by Martian sol (mission day) and filter by camera.
3) EPIC (Earth Polychromatic Imaging Camera) – explore daily Earth images by date.

User can register an account to save his favorite NASA posts as bookmarks (stored in project database), 
update profile information, and upload a custom avatar.

//////////////////////////////////////////////////////////////

SERVER Install:

npm init -y
npm install express express-async-handler nodemon jsonwebtoken bcryptjs mongoose cors multer dotenv axios
npm install --save-dev cross-env

run server: npm start
run tests: npm test

//////////////////////////////////////////////////////////////

CLIENT Install:

npm create vite@latest client -- --template react 

npm install

npm install react-router-dom redux react-redux redux-persist redux-thunk axios

npm install -D tailwindcss@^3.4.17 postcss autoprefixer

npx tailwindcss init -p

npm install flowbite flowbite-react

Add .env file with:
VITE_BACKEND_URL = http://localhost:3000

run client: npm run dev
