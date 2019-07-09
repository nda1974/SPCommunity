// equal to: import { sp } from "@pnp/sp;"
const sp =  require("@pnp/sp").sp;

// equal to: import { SPFetchClient } from "@pnp/nodejs;"
const SPFetchClient = require("@pnp/nodejs").SPFetchClient;

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    
    const APP_SECRET ='syHN62TnKNEXghSakgY4bWjchgXwbsLRE6c4RpXU86g=';
    const CLIENT_ID ='ec2e0303-bd8f-43f6-8148-76d7204bedea';
    const SHAREPOINT_URL = 'https://lbforsikring.sharepoint.com/sites/Skade';

    
    

    if (req.query.name || (req.body && req.body.name)) {

        sp.setup({
            sp: {
                fetchClientFactory: () => {
                    return new SPFetchClient(
                    this.SHAREPOINT_URL, 
                    this.CLIENT_ID, 
                    this.APP_SECRET);
                }
            }
        });

    
        /*
        const web = await sp.web.lists.getById('fc98c6c2-1d45-4502-aedd-970f39c474eb').then((list)=>{
            console.log(list);
        });
        */
        const web = await sp.web.lists.getByTitle('LeaderGroup').select('Title').get().then((list)=>{
            console.log(list);
        });


        // var storageAccount ='lbfstoragedevtest'
        // var storageAccessKey ='GBnc8a2MmGe5I1KQMIfLo33hMFR/U6BXcMlY7mmUwH/P6hEVXXW5LgiSKavXoQ4oD22y/NYhz3AYjhj+yf+W6g=='
        // var azure = require('azure-storage');
        // var container = 'lbf-sharepoint-blobs'
        // container = 'lbf-sharepoint-public-blobs'

        // var blobName = 'AzureFile.csv'
        // var fs = require('fs');
        // const path = require('path');
        // const fetch = require('node-fetch');
        // const stream = require('stream');
        // const Papa = require("papaparse");
        
        // const containerURL='https://lbfstoragedevtest.blob.core.windows.net/lbf-sharepoint-public-blobs';


        // fetch(containerURL +'/' + blobName)
        // .then(response => response.text())
        // .then(csv => {
        //     var data = Papa.parse(csv);
            
        //     data.forEach(row => {
        //         console.log(r);
        //     });
        // })

        
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: "Hello " + (req.query.name || req.body.name)
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
};

