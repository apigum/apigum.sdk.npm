# apigum-sdk
[![Build Status](https://api.travis-ci.org/pomeo/node-apigum-sdk.png)](http://travis-ci.org/pomeo/node-billiving)
[![Dependencies](https://david-dm.org/pomeo/node-apigum-sdk.png)](https://david-dm.org/pomeo/node-apigum-sdk)
[![NPM version](https://badge.fury.io/js/apigum-sdk.svg)](http://badge.fury.io/js/apigum-sdk)

apigum-sdk is npm library for managing integrations between popular cloud applications like Twilio, SendGrid, Shopify and others.
## Installation

- npm install apigum-sdk

## Usage

 - Log into your [apigum.com](apigum.com) account to obtain your API Key.  
 - You'll also need to obtain the relevant application keys. For example secret key for Stripe or Subdomain and Api Key for Freshdesk.
 - This library makes calls to the [apigum REST API](https://api.apigum.com/help).
 - This SDK includes a current snapshot of [supported integrations](https://github.com/apigum/apigum.sdk.npm/blob/master/generation/index.js). This of course can be overriden by picking up new integration ids @ apigum.com.

### Setup
```js
  this.freshdeskCredentials = {}
  this.stripeCredentials = {}

  //set up credentials
  this.freshdeskCredentials[Apps.Freshdesk.Keys.API_KEY] = "<your Freshdesk api key>"
  this.freshdeskCredentials[Apps.Freshdesk.Keys.SUB_DOMAIN] = "<your Freshdesk subdomain>"

  //set up credentials
  this.stripeCredentials[Apps.Stripe.Keys.SECRET_KEY] = "<your Stripe secret key>"

  //obtain api key at https://account.apigum.com/api
  const apiKey = "<Your API key>"
  this.integration = new Integration(apiKey);
```

### Create Integration

```js
  const freshdesk = AppHelper.configure(Apps.Freshdesk.AppId, this.freshdeskCredentials);
  const stripe = AppHelper.configure(Apps.Stripe.AppId, this.stripeCredentials);

  const integrationId = await this.integration.create(freshdesk, stripe,
      Apps.Freshdesk.Integrations.CREATE_FRESHDESK_CONTACT_FOR_NEW_STRIPE_CUSTOMERS);

  //You may clone other integrations on apigum.com by using the id (last part) in the URL:
  //e.g.: https://www.apigum.com/Integrations/{integration-id}
```

### Update Integration

```js
    const script = fs.readFileSync(path.resolve(__dirname, "./integration.js"), "utf8");
    
    await this.integration.updateScript(integrationId , script);          
```

#### Sample integration.js
```js
//Integration code for => "Create Freshdesk contact for new Stripe customers"
  var freshdesk={};

  function setElements(stripe) {
      freshdesk.name = stripe.description;
      freshdesk.email = stripe.email;

  }

  function template() {
      return `{
    "name": "${freshdesk.name}",
    "email": "${freshdesk.email}",
    "other_emails": []
  }`;
  }

  module.exports = function (context, events) {

      let actions = [];

      for (let event of events.body) {
          setElements(event);
          actions.push(template());
      }

      context.res = {
          body: actions
      };

      context.done();
  };            
```

### Delete Integration
```js
  await this.integration.delete(integrationId);
```

### Start Running
```js
  //by default integrations start running when created
  //this method may be used if integration has been stopped.
  await this.integration.publish(integrationId);
```

### Stop Running
```js
  //suspends integration data synchronization
  await this.integration.unpublish(integrationId);
```

For product information please visit our site at https://www.apigum.com
