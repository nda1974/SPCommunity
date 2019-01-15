// equal to: import { sp } from "@pnp/sp;"
const sp =  require("@pnp/sp").sp;

// equal to: import { SPFetchClient } from "@pnp/nodejs;"
const SPFetchClient = require("@pnp/nodejs").SPFetchClient;
const SPOAuthEnv = require("@pnp/nodejs").SPOAuthEnv;

module.exports =  function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    const  returnVal="I'm in sync";
        context.res = {
            // status: 200,
            body: '{"BatchComitted":"'+ returnVal+ '"}'
        };
    // if (req.query.batchID) {
    //     sp.setup({
    //         sp: {
    //             fetchClientFactory: () => {
    //                 return new SPFetchClient(
    //                   "https://lbforsikring.sharepoint.com/sites/Skade", 
    //                   process.env.spId, 
    //                   process.env.spSecret,
    //                   SPOAuthEnv.SPO
    //                   );
    //             },
    //             headers:{
    //                 'Content-Type': 'application/json'
    //             },
    //             baseUrl:"https://lbforsikring.sharepoint.com/sites/skade"
    //         }
    //     });

    //     const  returnVal=await _getDepartments(req.query.batchID);
    //     const  returnVal="HEST";
    //     context.res = {
    //         // status: 200,
    //         body: '{"BatchComitted":"'+ returnVal+ '"}'
    //     };
    // }
    // else{
    //     context.res = {
    //             status: 400,
    //             body: '{"Error in request":"Error"}'
    //         };
    // }
    
    
    
};

// async function _getDepartments(batchID)
// {
//     // const items = await sp.web.lists.getById("433d918b-2e51-4ebb-ab2a-3fc9e2b5c540").items.filter("Id eq '" + itemId + "' and BatchID eq 'BATCH-NICD-8'").get();
//     const items = await sp.web.lists.getById("433d918b-2e51-4ebb-ab2a-3fc9e2b5c540").items.filter("BatchID eq '"+ batchID +"'").select('ControlSubmitted').get();
//     var isAllControlsSubmitted=true;
//     items.map(item=>{
//         if(item.ControlSubmitted==false){
//             isAllControlsSubmitted=false;
//         }
//         console.log(item);
//     })
        
//     return isAllControlsSubmitted;
    
// }

