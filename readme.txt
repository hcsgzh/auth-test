## Instruction

1. run the Operator-Console project

You need to install node JS and run `npm install --save` firstly to install all the packages needed. 

Secondly, you need to build the Single Page APP by using `npm run build`.

Then run the fllowing command to start the server.

> node .\server\server.js

The Operator-Console will run at localhost:3005

2. Development 

develop the frontend with live debug

> npm run watch

develop the backend with live debug

> npx nodemon --inspect .\server\server.js

Option:
go to Chrome and type `about:inspect` in your google Chrome. You can debug and see all console.log properly.

