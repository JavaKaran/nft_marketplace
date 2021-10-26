const { assert } = require('chai');

const CryptoBoys = artifacts.require('./CryptoBoys.sol');

require('chai')
  .use(require('chai-as-promised'))
  .should();

contract("CryptoBoys", async (accounts) => {
  let cryptoBoys, result, cryptoBoysCount;

  before(async () => {
    cryptoBoys = await CryptoBoys.deployed();
  });

  describe("Deployment", async () => {
    it("contract hass an address", async () => {
      const address = await cryptoBoys.address;
      address.notEqual(address, 0x0);
      address.notEqual(address, "");
      address.notEqual(address, null);
      address.notEqual(address, undefined);
    });

    it("has a name", async () => {
      const name = await cryptoBoys.collectionName();
      assert.equal(name,"Crypto Boys Collection");
    });

    it("has a symbol", async () => {
      const symbol = await cryptoBoys.collectionSymbol();
      assert.equal(symbol, "CB");
    });
  });

  describe("application feature", async () => {
    it("allows user to mint ERC 721 token", async () => {
      cryptoBoysCount = await cryptoBoys.cryptoBoysCounter();
      assert.equal(cryptoBoysCounter.toNumber(), 0);
    });

    /* let tokenExists;
    tokenExists = await cryptoBoys.getTokenExists(1, { from: accounts[0] });
    assert.equal(tokenExists, false);

    let tokenURIExists;
    tokenURIExists = await cryptoBoys.getTokenURIExits("" , { from: accounts[0]} });
    assert.equal(tokenURIExists, false);
    */

    it("returns adress of the token owner", async () => {
      const tokenOwner = await cryptoBoys.getTokenOwner(1);
      assert.equal(tokenOwner, accounts[0]);
    });
    /*
    it("returns metadata of the token" , async () => {
        const tokenMetaData = await cryptoBoys.getTokenMetaData(1);
        assert.equal(tokenMetaData, "");
    });
    */
    it("returns total number of tokens owned by an address", async () => {
      const totalNumberOfTokensOwnedByAnAddress = await cryptoBoys.getTotalNumberOfTokensOwnedByAnAddress(
        accounts[0]
      );
      assert.equal(totalNumberOfTokensOwnedByAnAddress.toNumber(), 3);
    });

    it("allows users to buy token for specified ethers", async () => {
      const oldTokenOwner = await cryptoBoys.getTokenOwner(1);
      assert.equal(oldTokenOwner, accounts[0]);

      let oldTokenOwnerBalance;
      oldTokenOwnerBalance = await web3.eth.getBalance(accounts[0]);
      oldTokenOwnerBalance = new web3.utils.BN(oldTokenOwnerBalance);

      let oldTotalNumberOfTokensOwnedBySeller;
      oldTotalNumberOfTokensOwnedBySeller = await cryptoBoys.getTotalNumberOfTokensOwnedByAnAddress(
        accounts[0]
      );
      assert.equal(oldTotalNumberOfTokensOwnedBySeller.toNumber(), 3);

      let cryptoBoys;
      cryptoBoys = await cryptoBoys.allCryptoBoys(1, {
        from: accounts[0],
      });
      assert.equal(cryptoBoys.numberOfTransfers.toNumber(), 0);

      result = await cryptoBoys.buyToken(1, {
        from: accounts[2],
        value: web3.utils.toWei("1", "Ether"),
      });

      const newTokenOwner = await cryptoBoys.getTokenOwner(1);
      assert.equal(newTokenOwner, accounts[2]);

      let newTokenOwnerBalance;
      newTokenOwnerBalance = await web3.eth.getBalance(accounts[0]);
      newTokenOwnerBalance = new web3.utils.BN(newTokenOwnerBalance);

      let newTotalNumberOfTokensOwnedBySeller;
      newTotalNumberOfTokensOwnedBySeller = await cryptoBoys.getTotalNumberOfTokensOwnedByAnAddress(
        accounts[0]
      );
      assert.equal(newTotalNumberOfTokensOwnedBySeller.toNumber(), 2);

      cryptoBoys = await cryptoBoys.allCryptoBoys(1, {
        from: accounts[0],
      });
      assert.equal(cryptoBoys.numberOfTransfers.toNumber(), 1);

      let price;
      price = web3.utils.toWei("1", "Ether");
      price = new web3.utils.BN(price);

      const exepectedBalance = oldTokenOwnerBalance.add(price);
      assert.equal(
        newTokenOwnerBalance.toString(),
        exepectedBalance.toString()
      );

      cryptoBoys = await cryptoBoys.allCryptoBoys(1, {
        from: accounts[0],
      });
      assert.equal(cryptoBoys.currentOwner, accounts[2]);

      await cryptoBoys.buyToken(2, {
        from: 0x0000000000000000000000000000000000000000,
        value: web3.utils.toWei("1", "Ether"),
      }).should.be.rejected;

      await cryptoBoys.buyToken(56, {
        from: accounts[4],
        value: web3.utils.toWei("1", "Ether"),
      }).should.be.rejected;

      await cryptoBoys.buyToken(3, {
        from: accounts[0],
        value: web3.utils.toWei("1", "Ether"),
      }).should.be.rejected;

    });

    it("allows users to change token price", async () => {
      let cryptoBoysPrice;
      cryptoBoysPrice = await cryptoBoys.allCryptoBoys(1, {
        from: accounts[0],
      });
      assert.equal(web3.utils.fromWei(cryptoBoysPrice.price, "ether"), 1);

      result = await cryptoBoys.changeTokenPrice(
        1,
        web3.utils.toWei("2", "Ether"),
        {
          from: accounts[2],
        }
      );

      cryptoBoysPrice = await cryptoBoys.allCryptoBoys(1, {
        from: accounts[0],
      });
      assert.equal(web3.utils.fromWei(cryptoBoysPrice.price, "ether"), 2);

      await cryptoBoys.changeTokenPrice(1, web3.utils.toWei("3", "Ether"), {
        from: 0x0000000000000000000000000000000000000000,
      }).should.be.rejected;

      await cryptoBoys.changeTokenPrice(82, web3.utils.toWei("3", "Ether"), {
        from: accounts[2],
      }).should.be.rejected;

      await cryptoBoys.changeTokenPrice(1, web3.utils.toWei("3", "Ether"), {
        from: accounts[6],
      }).should.be.rejected;

    });

    it("allows users to toggle between setting the token for sale or not for sale", async () => {
      let cryptoboy;
      cryptoboy = await cryptoBoys.allCryptoBoys(1, {
        from: accounts[0],
      });
      assert.equal(cryptoboy.forSale, true);

      result = await cryptoBoys.toggleForSale(1, { from: accounts[2] });

      cryptoboy = await cryptoBoys.allCryptoBoys(1, {
        from: accounts[0],
      });
      assert.equal(cryptoboy.forSale, false);

      result = await cryptoBoys.toggleForSale(1, { from: accounts[2] });

      cryptoboy = await cryptoBoys.allCryptoBoys(1, {
        from: accounts[0],
      });
      assert.equal(cryptoboy.forSale, true);

      await cryptoBoys.toggleForSale(1, {
        from: 0x0000000000000000000000000000000000000000,
      }).should.be.rejected;

      await cryptoBoys.toggleForSale(94, { from: accounts[2] }).should.be
        .rejected;

      await cryptoBoys.toggleForSale(1, { from: accounts[8] }).should.be
        .rejected;

    });

  })

})