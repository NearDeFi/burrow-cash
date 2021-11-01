near-dapp
==================

This [React] app was initialized with [create-near-app]


Quick Start
===========

To run this project locally:

1. Prerequisites: Make sure you've installed [Node.js] ≥ 12
2. Install dependencies: `yarn install`
3. Run the local development server: `yarn dev` (see `package.json` for a
   full list of `scripts` you can run with `yarn`)

Now you'll have a local development environment backed by the NEAR TestNet!

Go ahead and play with the app and the code. As you make code changes, the app will automatically reload.


Exploring The Code
==================

1. The "backend" code lives in [NearDeFi/burrowland/contract](https://github.com/NearDeFi/burrowland/tree/main/contract). See that repo's README and it's [API.md](https://github.com/NearDeFi/burrowland/blob/main/contract/API.md) for more info.
2. The frontend code lives in the `/src` folder. `/src/index.html` is a great place to start exploring. Note that it loads in `/src/index.js`, where you can learn how the frontend connects to the NEAR blockchain.
3. Tests: there are different kinds of tests for the frontend and the smart contract. See [NearDeFi/burrowland](https://github.com/NearDeFi/burrowland/)'s `README` for info about how it's tested. The frontend code gets tested with [jest]. You can run both of these at once with `yarn run test`.


Deploy
======

Step 0: set contract name in code
---------------------------------

Once the "backend" code - the smart contract - has been deployed into a [near account][NEAR accounts], you need to modify the line in [src/config.ts](src/config.ts) that sets the account name of the contract. Set it to the account id of the deployed contract.

    const LOGIC_CONTRACT_NAME = process.env.CONTRACT_NAME || 'near-dapp.YOUR-NAME.testnet'

Step 1: deploy!
---------------

One command:

    yarn deploy

As you can see in `package.json`, this does the following:

1. builds & deploys frontend code to GitHub using [gh-pages]. This will only work if the project already has a repository set up on GitHub. Feel free to modify the `deploy` script in `package.json` to deploy elsewhere.

Troubleshooting
===============

On Windows, if you're seeing an error containing `EPERM` it may be related to spaces in your path. Please see [this issue](https://github.com/zkat/npx/issues/209) for more details.


  [React]: https://reactjs.org/
  [create-near-app]: https://github.com/near/create-near-app
  [Node.js]: https://nodejs.org/en/download/package-manager/
  [jest]: https://jestjs.io/
  [NEAR accounts]: https://docs.near.org/docs/concepts/account
  [NEAR Wallet]: https://wallet.testnet.near.org/
  [near-cli]: https://github.com/near/near-cli
  [gh-pages]: https://github.com/tschaub/gh-pages
