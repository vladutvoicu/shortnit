# :link: ShortnIt

Monorepo of a URL shortening service: https://shortnit.web.app/

&nbsp;

## :hammer_and_wrench: Built using

- [TypeScript](https://www.typescriptlang.org)
- [React](https://react.dev)
- [Express.JS](https://expressjs.com)
- [MongoDB](https://mongodb.com)

&nbsp;

## :clipboard: Project structure
There are 2 packages inside the project:

**Client: React application** <br/>
**Server: Express application**

Each of the packages have their own package.json file, so they define their dependencies as well as they have full autonomy to publish a new version of the package into NPM or Yarn registry.

```
├───client
│   ├───public
│   ├───src
│   │   ├───assets        // Static assets
│   │   │   └───images
│   │   ├───components    // Reusable components
│   │   │   ├───Features
│   │   │   ├───Shortener
│   │   │   └───SideBar
│   │   ├───pages         // Pages that are rendered by the router
│   │   │   ├───Main
│   │   │   ├───PasswordReset
│   │   │   └───Redirect
│   │   ├───types         // Type definitions
│   │   └───App.tsx       // App routing
│   └───package.json
└───server
    └───src
    │   ├───config         // Configuration file for the server
    │   ├───controllers    // Controller functions for handling HTTP requests
    │   ├───library        // Utility functions used throughout the server application
    │   ├───middleware     // Middleware functions used to intercept requests
    │   ├───models         // Data models
    │   ├───routes         // Route definitions
    │   └───server.ts      // Server
    └───package.json
```


## :key: Environment variables

### Client

The client uses the following environment variables: <br/>
```REACT_APP_API_KEY```: API key used to access the backend server <br/>
```REACT_APP_API_URL```: URL of the backend server. <br/>

&nbsp;

### Server

The server uses the following environment variables: <br/>
```API_KEY```: Unique code or token for API authorization <br/>
```MONGO_USERNAME```: Username associated with the MongoDB account that has the necessary privileges to access the required database <br/>
```MONGO_PASSWORD```: Password associated with the MongoDB username <br/>
```DB_NAME```: Name of the database that the application should connect to <br/>
```SERVER_PORT```: Port number that the server should listen on <br/>
```SMTP_EMAIL```: Email address of the SMTP transporter that is used to send emails <br/>
```SMTP_PASSWORD```: Password associated with the SMTP email <br/>

&nbsp;

## :gear: Running the packages locally

1. Clone the repository:
```bash
git clone https://github.com/vladutvoicu/shortnit.git
```

2. Install dependencies in the desired package (**client/server**):
```bash
yarn install
```

3. Start the desired app (**client/server**):
```bash
yarn start
```

&nbsp;

## :computer: :iphone: Demonstrations

<img src="https://user-images.githubusercontent.com/107242590/234950184-5997f3ca-1664-4f04-8e35-076da83b0df8.png" height="350" />
<img src="https://user-images.githubusercontent.com/107242590/234950197-d9cb6283-bad3-4737-a12e-53bcec3713d3.png" height="350" />
<img src="https://user-images.githubusercontent.com/107242590/234950496-65f523e9-26d6-4f08-afa5-4fe8103b6f3d.jpeg" height="425"/>
<img src="https://user-images.githubusercontent.com/107242590/234950518-8ba9c58f-ca07-4e36-90cb-2d9dcaebe102.jpg" height="425"/> 

&nbsp;

## :writing_hand: Authors
- [Vlăduț Voicu](https://github.com/vladutvoicu)

## :memo: License
- This repository has an [MIT license](https://github.com/vladutvoicu/shortnit/blob/master/LICENSE).
