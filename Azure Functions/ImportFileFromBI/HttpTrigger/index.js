// equal to: import { sp } from "@pnp/sp;"
const sp =  require("@pnp/sp").sp;

// equal to: import { SPFetchClient } from "@pnp/nodejs;"
const SPFetchClient = require("@pnp/nodejs").SPFetchClient;
const SPOAuthEnv = require("@pnp/nodejs").SPOAuthEnv;

module.exports = async function (context, req) {
    const APP_SECRET ='Me0V7uQy2cFtLCEjk2kSLAWiktVr1UAnPRUZJFDxWoE=';
    const CLIENT_ID ='e722606e-7e4e-41bb-b9bf-197d5d5240d7';
    const SHAREPOINT_URL = 'https://lbforsikring.sharepoint.com/sites/Skade';

    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.query.name || (req.body && req.body.name)) {

        
        sp.setup(
            { sp: {
                 
                fetchClientFactory: () =>   {  
                                                return new SPFetchClient(SHAREPOINT_URL, 
                                                CLIENT_ID, 
                                                APP_SECRET,
                                                SPOAuthEnv.SPO); 
                                             },
                                            baseUrl:SHAREPOINT_URL 
                    } 
            });
            // const list = await sp.web.lists.getById('fc98c6c2-1d45-4502-aedd-970f39c474eb').then((l)=>{
            //     console.log(l);
            // });

            const listTitle= await sp.web.lists.getById('fc98c6c2-1d45-4502-aedd-970f39c474eb').select('Title').get().then(
                (res)=>{
                    console.log(res);
                }
            );
            // const list = sp.web.lists.getById('fc98c6c2-1d45-4502-aedd-970f39c474eb');
            // await list.items.getAll().then((items)=>{
            //     console.log(items);
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