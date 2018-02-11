const proxyquire = require('proxyquire').noCallThru();
const {expect} = require('chai');


const azureADAuthModeStub = {};
const testAuthModeStub = {};
const getAuthMode = proxyquire('../../src/auth', {
    './azureADAuthMode': azureADAuthModeStub,
    './testAuthMode': testAuthModeStub
});


describe('Auth mode factory', () => {
    it('should return the auth test mode when test mode is set to true', () => {
        const authMode = getAuthMode(true);
        expect(authMode).to.equal(testAuthModeStub);
    });

    it('should return the Azure AD auth mode when test mode is set to false', () => {
        const authMode = getAuthMode(false);
        expect(authMode).to.equal(azureADAuthModeStub);
    });
});