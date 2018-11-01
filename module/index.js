const request = require('request-promise-native')
const IntegrationCopyRequest = require('../models/integrationCopyRequest')
const IntegrationCopyItem = require('../models/integrationCopyItem')

const baseApi = "https://api.apigum.com";

class Integration {
    constructor(apiKey){
        this.APIKey = apiKey
    }

    updateCredentials(apiKey, credentials){
        throw new Error('Not Implemented');
    }

    async create(triggerApp, actionApp, integrationId){
        // set trigger
        const trigger = new IntegrationCopyItem();
        trigger.AppId = triggerApp.AppId;

        Object.entries(triggerApp.Keys).forEach((item) => {
            trigger.KeyValuePairs.push({
                Name: item[0],
                Value: item[1],
            })
        })

        // set action
        const action = new IntegrationCopyItem();
        action.AppId = actionApp.AppId;

        Object.entries(actionApp.Keys).forEach((item) => {
            action.KeyValuePairs.push({
                Name: item[0],
                Value: item[1],
            })
        })

        const integration = new IntegrationCopyRequest();

        integration.TriggerKeys.push(trigger);
        integration.ActionKeys.push(action);

        return await request({
            uri: `${baseApi}/v1/integrations/${integrationId}/copy`,
            headers: {
                Authorization: `Basic ${new Buffer(`${this.APIKey}:X`, "ascii").toString('base64')}`
            },
            method: 'POST',
            body: integration,
            json: true
        })
    }

    async updateScript(integrationId, script){
        const body = {
            Code: script
        }
        return await request({
            uri: `${baseApi}/v1/integrations/${integrationId}/code`,
            headers: {
                Authorization: `Basic ${new Buffer(`${this.APIKey}:X`, "ascii").toString('base64')}`
            },
            method: 'PUT',
            body,
            json: true
        })
    }

    async delete(integrationId){
        return await request({
            uri: `${baseApi}/v1/integrations/${integrationId}`,
            headers: {
                Authorization: `Basic ${new Buffer(`${this.APIKey}:X`, "ascii").toString('base64')}`
            },
            method: 'DELETE'
        })
    }

    clearCache(integrationId){
        throw new Error('Not Implemented');
    }

    async publish(integrationId){
        return await request({
            uri: `${baseApi}/v1/integrations/${integrationId}/publish`,
            headers: {
                Authorization: `Basic ${new Buffer(`${this.APIKey}:X`, "ascii").toString('base64')}`
            },
            method: 'PUT',
            body: null
        })
    }

    async unpublish(integrationId){
        return await request({
            uri: `${baseApi}/v1/integrations/${integrationId}/unpublish`,
            headers: {
                Authorization: `Basic ${new Buffer(`${this.APIKey}:X`, "ascii").toString('base64')}`
            },
            method: 'PUT',
            body: null
        })
    }
}

module.exports = Integration