
import testmain from './testmain.js';
import testlibrary from './testlibrary.js';
import testsender from './testlogsend.js';
import { expect } from 'chai';

describe("testmain", () => {
    context("When creating a new instance of SimonBase", () => {
        it("it executes properly", () => {
            expect(testmain()).to.equal(true);
        });
    });
});

describe("testlibrary", () => {
    context("When bootstrapping the LoggingLibrary", () => {
        it("it initializes", () => {
            expect(testlibrary()).to.equal(true);
        });
    });
});

describe("testsender", () => {
    context("When sending with the LoggingLibrary", () => {
        it("it works", () => {
            expect(testsender()).to.equal(true);
        });
    });
});