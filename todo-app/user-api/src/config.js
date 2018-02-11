module.exports = {
    isTestMode: process.env.IS_TEST_MODE || false,
    mongoDbUrl: process.env.MONGODB_URL,
    logLevel: process.env.APP_LOG_LEVEL || 'info',
    azureIdentityMetaData: process.env.AZURE_IDENTITY_META_DATA,
    azureClientId: process.env.AZURE_APP_ID
};