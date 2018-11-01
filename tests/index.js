const fs = require('fs');
const path = require('path');
const Apps = require('../generation')
const Integration = require('../module')
const AppHelper = require('../helpers/appHelper')

class IntegrationTest{
    constructor(){
        this.freshdeskCredentials = {}
        this.stripeCredentials = {}

        //set up credentials
        this.freshdeskCredentials[Apps.Freshdesk.Keys.API_KEY] = "xf0PwcmMaKQ3Bi8fSqi"
        this.freshdeskCredentials[Apps.Freshdesk.Keys.SUB_DOMAIN] = "shukyba"

        //set up credentials
        this.stripeCredentials[Apps.Stripe.Keys.SECRET_KEY] = "sk_test_VOnsF96Ou3pA6jXuigcjoKlY"

        //obtain api key at https://account.apigum.com/api
        const apiKey = "6125e0b5-3920-4d05-8bbd-52264ce5c8ba"
        this.integration = new Integration(apiKey);

        this.integrationID = null
    }

    async createIntegrationTest(){
        const freshdesk = AppHelper.configure(Apps.Freshdesk.AppId, this.freshdeskCredentials);
        const stripe = AppHelper.configure(Apps.Stripe.AppId, this.stripeCredentials);

        this.integrationID = await this.integration.create(freshdesk, stripe,
            Apps.Freshdesk.Integrations.CREATE_FRESHDESK_CONTACT_FOR_NEW_STRIPE_CUSTOMERS);
    }

    async updateIntegrationScript(){
        const script = fs.readFileSync(path.resolve(__dirname, "./integration.js"), "utf8");

        await this.integration.updateScript(this.integrationID , script);
    }

    async deleteIntegration() {
        await this.integration.delete(this.integrationID);
    }

    async start(){
        await this.integration.publish(this.integrationID);
    }

    async stop(){
        await this.integration.unpublish(this.integrationID);
    }
}

const UpTesting = async () => {
    const integrationTest = new IntegrationTest()

    await integrationTest.createIntegrationTest()
    await integrationTest.start()
    await integrationTest.updateIntegrationScript()
    await integrationTest.stop()
    await integrationTest.deleteIntegration()
}

UpTesting()
    .then(() => {
        process.exit(0)
    })
    .catch(err => {
        console.log(err)
        process.exit(1)
    })