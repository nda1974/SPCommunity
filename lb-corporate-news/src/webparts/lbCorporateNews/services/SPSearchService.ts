import { IWebPartContext } from "@microsoft/sp-webpart-base";
import {ISearchResult, ISearchResults, IRefinementResult, IRefinementValue, IRefinementFilter, NewsItem} from '../ISearchResults'
import pnp, { ConsoleListener, Logger, LogLevel, SearchQuery, SearchQueryBuilder, SearchResults, setup, Web, Sort, SortDirection } from "sp-pnp-js";
import * as moment from "moment";
import { SearchProperty } from 'sp-pnp-js/lib/sharepoint/search';
export default class SPSearchService{
    private _context: IWebPartContext;


    public constructor(webPartContext: IWebPartContext) {
        this._context = webPartContext;

        // Setup the PnP JS instance
        const consoleListener = new ConsoleListener();
        Logger.subscribe(consoleListener);

        // To limit the payload size, we set odata=nometadata
        // We just need to get list items here
        // We also set the SPFx context accordingly (https://github.com/SharePoint/PnP-JS-Core/wiki/Using-sp-pnp-js-in-SharePoint-Framework)
        
        setup({
            sp: {
                headers: {
                    Accept: "application/json; odata=nometadata"
                },
                baseUrl:"https://lbforsikring.sharepoint.com/sites/intra"
            },
            // spfxContext: this._context,
        });
    }


//
    
        public async search(queryText:string):Promise<ISearchResults>{
            

            let searchQuery: SearchQuery = {};
            let filterOnContentType:string="";
            let selectProperties:string[]=["Title","PubliseringsdatoOWSDATE"];
            var now=moment().format("YYYY-MM-DDT00:00:00Z");
            var d = new Date();
            
            searchQuery.Querytext="ContentType:"+filterOnContentType+" AND " + queryText;    
            searchQuery.Querytext="ContentType:LB Nyhed* AND PubliseringsdatoOWSDATE ge datetime'" + d.toISOString() +"'";    
            // searchQuery.Querytext="ContentType:LB Nyhed*";    
            // searchQuery.Querytext="ContentType:LB Nyhed* AND PubliseringsdatoOWSDATE le datetime'" + d.toISOString() +"'";    
            searchQuery.SelectProperties=selectProperties;
            // .filter(`Start lt datetime'${today.toISOString()}' and Slut gt datetime'${today.toISOString()}'`)
            const r = await pnp.sp.search(searchQuery);
            const allItemsPromises: Promise<ISearchResult>[] = [];
            
            let results: ISearchResults = {
                RelevantResults : [],
                RefinementResults: [],
                TotalRows: 0,
            };
            
            if (r.RawSearchResults.PrimaryQueryResult) {
                            
                // Be careful, there was an issue with paging calculation under 2.0.8 version of sp-pnp-js library
                // More info https://github.com/SharePoint/PnP-JS-Core/issues/535
                const r2 = await r.getPage(1,100);
                
                const resultRows = r2.RawSearchResults.PrimaryQueryResult.RelevantResults.Table.Rows;
                console.log (resultRows);
                let refinementResultsRows = r2.RawSearchResults.PrimaryQueryResult.RefinementResults;
        
                const refinementRows = refinementResultsRows ? refinementResultsRows["Refiners"] : [];
        
                resultRows.map((elt) => {
        
                    const p1 = new Promise<ISearchResult>((resolvep1, rejectp1) => {
                    
                        // Build item result dynamically
                        // We can't type the response here because search results are by definition too heterogeneous so we treat them as key-value object
                        let result: ISearchResult = {};
        
                        elt.Cells.map((item) => {
                            result[item.Key] = item.Value;
                        });
                        resolvep1(result);
                    });
        
                    allItemsPromises.push(p1);    
                    // Resolve all the promises once to get news
                                
                });
                // Map refinement results                    
                refinementRows.map((refiner:any) => {
                  
                  let values: IRefinementValue[] = [];
                  refiner.Entries.map((item) => {
                      
                      values.push({
                        //   RefinementCount: (Number)item.RefinementCount,
                        RefinementCount:Number(item.RefinementCount),
                        // RefinementName:  this._formatDate(item.RefinementName), //This value will appear in the selected filter bar
                        RefinementName:  item.RefinementName,
                        RefinementToken: item.RefinementToken,
                        // RefinementValue: this._formatDate(item.RefinementValue), // This value will appear in the filter panel
                        RefinementValue: item.RefinementValue // This value will appear in the filter panel
                      });
                  });
        
                  
              });
            }
            const relevantResults: ISearchResult[] = await Promise.all(allItemsPromises);
            results.RelevantResults = relevantResults;
            return results;
          
    }
    
    /**
     * Find and eeplace ISO 8601 dates in the string by a friendly value
     * @param inputValue The string to format
     */
    private static _formatDate(inputValue: string): string {
        
        const iso8061rgx = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/g;
        const matches = inputValue.match(iso8061rgx);

        let updatedInputValue = inputValue;

        if (matches) {
            matches.map(match => {
                updatedInputValue = updatedInputValue.replace(match, moment(match).format("LL"));
            });
        }

        return updatedInputValue;        
    }
    
  
}

