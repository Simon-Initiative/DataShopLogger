
import testmain from './testmain.js';
import testlibrary from './testlibrary.js';
import testsender from './testlogsend.js';
import testsenderxapi from './testlogsend-xapi.js';
import { expect } from 'chai';

describe("testmain", () => {
    context("When creating a new instance of SimonBase", () => {
        it("it executes debug call", () => {
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
        it("it sends a message to the Datashop QA server", () => {
            expect(testsender()).to.equal(true);
        });
    });
});

describe("testsenderxapi", () => {
    context("When sending with the LoggingLibrary (XAPI)", () => {
        it("it sends a message to the Copia QA server", () => {
            expect(testsenderxapi()).to.equal(true);
        });
    });
});