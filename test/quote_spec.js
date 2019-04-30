var should = require("should");

var QuotedPremium = require("../models/QuotePremium");

describe("QuotedPremium", function(){

  describe("defaults", function(){

    var quotedPremium = {};

    before(function () {

        quotedPremium = new QuotedPremium();

    });

    it("has currency defined which is GBP", function(){

        quotedPremium.currency.should.equal("GBP");

    });

    it("has a premium discount init'd to 0", function(){

        quotedPremium.discount.should.equal(0);

    });

    it("has a premium before any applied discount which is init'd to 0", function(){

        quotedPremium.premiumBeforeDiscount.should.equal(0);

    });

    it("has a premium after any applied discount which init'd to 0", function(){

        quotedPremium.premium.should.equal(0);

    });

    it("has a pending status", function(){

        quotedPremium.status.should.equal("pending");

    });

    it("has a created date", function(){

        quotedPremium.createdAt.should.be.defined;

    });

    it("has a reference of unassigned", function(){

        quotedPremium.reference.should.equal("unassigned");

    });

  });

});