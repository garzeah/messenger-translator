<!-- PROJECT LOGO -->
<br />
<p align="center">
  <!-- <a href="https://github.com/garzeah/restaurant-tinder">
    <img src="src/assets/images/desktopLogo.png" alt="Decipher Logo">
  </a> -->

  <h3 align="center">Decipher</h3>

  <p align="center">
    Helps people overcome language barriers.
  </p>
</p>

<!-- ABOUT THE PROJECT -->

## About The Project

Decipher allows users to chat in different languages and overcome language barriers!

### Built With

- React
- Node
- Express
- Mongo

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/garzeah/decipher.git
   ```
2. Install NPM packages in both root and client directory
   ```sh
   npm install
   ```
3. Create a config folder and .env file in the server directory
4. Create a dev.js file in the config folder
5. Paste the following template in the keys.js file
   ```sh
   module.exports = {
      mongoURI: "",
   };
   ```
6. Enter your MongoURI (can get one from MongoDB Atlas)
7. Paste the following template in the .env file
   ```sh
   ACCESS_TOKEN_SECRET=myToken
   ```
8. Start the server
   ```sh
   npm start
   ```

<!-- CONTACT -->

## Contact

Andy Garcia: acgarzeah@gmail.com

Project Link: https://github.com/garzeah/decipher

Website: https://decipher-io.herokuapp.com/
