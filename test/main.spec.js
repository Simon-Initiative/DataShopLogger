
import testmain from './testmain.js';
import testlibrary from './testlibrary.js';
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
        it("connects to datashop", () => {
            expect(testlibrary()).to.equal(true);
        });
    });
});