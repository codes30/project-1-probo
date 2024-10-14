for windows users - 
1. install the cross-env package  (npm i cross-env)
2. install supertest library (npm i supertest)
3. install jest (npm i jest)
4. "scripts": {
    "test": "cross-env NODE_OPTIONS=\'$NODE_OPTIONS --experimental-vm-modules\' npx jest"
  }  
  add the script above in your package.json
5. copy the test file inside your root folder
6. fix the path of the imports in the test file if needed 
7. run "npm run test"


-------------------------------------------------------------------------------------------
for linux/mac users - 
1. install supertest library (npm i supertest)
2. install jest (npm i jest)
3. "scripts": {
    "test": "NODE_OPTIONS=\'$NODE_OPTIONS --experimental-vm-modules\' npx jest"
  }  
  add the script above in your package.json
4. copy the test file inside your root folder
5. fix the path of the imports in the test file if needed 
6. run "npm run test"
