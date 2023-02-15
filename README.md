# DataShopLogger
A reference implementation of a client-side library that exposes an API that logs to DataShop

# Building

After pulling from the git repository:

  npm install

To do a continous build for development purposes:

  npm run dev

To do a build that will be saved into ./lib,

  npm run build

We encourage new developers and users to first try out our sample code. To see a page using the library bring up this file in a browser:

  index.html

# Documentation

https://github.com/Simon-Initiative/DataShopLogger/wiki

Note re: Babel
=======================================
9/30/2019 - Dave Brown 
Had to force babel-loader downgrade to version 7 (npm install babel-loader@7 --save-dev) for compatibility with Babel 6.  Should consider updating to the current verison, Babel 7.  Note difference in syntax (@babel/module vs. babel-module).  Will take some refactoring.

