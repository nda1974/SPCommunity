const SPFetchClient = require("@pnp/nodejs").SPFetchClient;
const sp =  require("@pnp/sp").sp;
module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.query.name || (req.body && req.body.name)) {

        const siteName = req.query.site || req.body.site;
        // sp.setup({
        //     sp: {
        //         fetchClientFactory: () => {
        //             return new SPFetchClient(
        //               `https://lbforsikring.sharepoint.com/sites/Skade/`, 
        //               process.env.spId, 
        //               process.env.spSecret);
        //         },
        //     },
        // });

        // Get the web and all the Lists
        // const web = await sp.web.select("Title").expand('Lists').get();
        const list = await sp.web("Skade").lists.getByTitle('LeaderGroup').items.select("Title");


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
    context.done();
};