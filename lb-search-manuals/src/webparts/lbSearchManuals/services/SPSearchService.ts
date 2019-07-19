import { IWebPartContext } from "@microsoft/sp-webpart-base";
import {ISearchResult, ISearchResults, IRefinementResult, IRefinementValue, IRefinementFilter} from '../ISearchResults'
import pnp, { ConsoleListener, Logger, LogLevel, SearchQuery, SearchQueryBuilder, SearchResults, setup, Web, Sort, SortDirection, sp } from "sp-pnp-js";
import * as moment from "moment";
import { SearchProperty, SearchResult } from 'sp-pnp-js/lib/sharepoint/search';
import { ICustomSearchResults } from "../../../../lib/webparts/lbSearchManuals/ISearchResults";
export default class SPSearchService{
    private _context: IWebPartContext;


    public constructor(webPartContext: IWebPartContext) {
        this._context = webPartContext;

        //refinablestring00 = AnsvarCategory
        //refinablestring01 = HundCategory
        //refinablestring02 = BaadCategory
        //refinablestring03 = BaadArea
        //refinablestring04 = BilCategory

        //refinablestring05 = IndboCategory
        //refinablestring06 = IndboArea


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
                baseUrl:"https://lbforsikring.sharepoint.com/sites/skade"
            },
            // spfxContext: this._context,
        });
    }


//
    
    //     public async searchORG(queryText:string,refinementFilters:string[],manualType:string):Promise<ISearchResults>{
            
    //         if (manualType== 'undefined') {
    //             return;
    //         }

    //         let searchQuery: SearchQuery = {};
    //         let sortedRefiners: string[] = [];
    //         let selectPropertyCategory:string = ""
    //         let filterOnContentType:string="";
    //         let refinersMappedProperties:string="";
    //         let searchQueryQueryText:string="";
    //         let selectProperties:string[];

    //         selectProperties=['Title','Author',refinersMappedProperties,'Path','ContentType','LBInfo','LBTeaser','HitHighlightedSummary','Gruppe','Undergruppe'];
                    
            
    //         let rf:string[]=[];
    //         refinersMappedProperties="Gruppe";
    //         if (refinementFilters.length==1) {
    //             // searchQuery.Querytext=searchQueryQueryText;
    //             searchQuery.Querytext="ContentType:Skadehåndbog AND Håndbog:"+ manualType + " AND " + queryText + " " + refinersMappedProperties + ":" + refinementFilters[0];
    //         }
    //         else
    //         {
    //             searchQuery.Querytext="ContentType:Skadehåndbog AND Håndbog:"+ manualType + " AND " + queryText;    
                
    //         }
    //         console.log(searchQuery.Querytext)
    //         console.log(refinementFilters)
            
    //         searchQuery.TrimDuplicates=false;
    //         searchQuery.SelectProperties=selectProperties;
    //         searchQuery.Refiners=refinersMappedProperties;
            
    //         // searchQuery.RowLimit=500
    //         // searchQuery.StartRow = 501;
            
            
            
    //         const r = await pnp.sp.search(searchQuery);
    //         // pnp.sp.web.lists.getByTitle("SitePages").items.getById(2273).select("Title", "Lookup/Title", "Lookup/ID").expand("Lookup").get().then((item: any) => {
    //         //     console.log(item);
    //         // });
    //         const allItemsPromises: Promise<ISearchResult>[] = [];
    //         let refinementResults: IRefinementResult[] = [];
            
    //         // pnp.sp.web.lists.getByTitle("Ankenævnskendelser").items.get().then((items: any[]) => {
    //         //     console.log(items);
                
    //         // });
            


    //         // const allItemsPromises: Promise<ISearchResult>[] = [];
    //         let results: ISearchResults = {
    //           RelevantResults : [],
    //           RefinementResults: [],
    //           TotalRows: 0,
    //       };
    //         if (r.RawSearchResults.PrimaryQueryResult) {
                            
    //             // Be careful, there was an issue with paging calculation under 2.0.8 version of sp-pnp-js library
    //             // More info https://github.com/SharePoint/PnP-JS-Core/issues/535
                
    //             const r2 = await r.getPage(1,500);
    //             //const r3 = await r.get
                
    //             const resultRows = r2.RawSearchResults.PrimaryQueryResult.RelevantResults.Table.Rows;
    //             console.log (resultRows);
    //             let refinementResultsRows = r2.RawSearchResults.PrimaryQueryResult.RefinementResults;
        
    //             const refinementRows = refinementResultsRows ? refinementResultsRows["Refiners"] : [];
        
    //             resultRows.map((elt) => {
        
    //                 const p1 = new Promise<ISearchResult>((resolvep1, rejectp1) => {
                    
    //                     // Build item result dynamically
    //                     // We can't type the response here because search results are by definition too heterogeneous so we treat them as key-value object
    //                     let result: ISearchResult = {};
        
    //                     elt.Cells.map((item) => {
    //                         result[item.Key] = item.Value;
    //                     });
    //                     resolvep1(result);
    //                 });
        
    //                 allItemsPromises.push(p1);    
    //                 // Resolve all the promises once to get news
                                
    //             });
    //             // Map refinement results                    
    //             refinementRows.map((refiner:any) => {
                  
    //               let values: IRefinementValue[] = [];
    //               refiner.Entries.map((item) => {
                      
    //                   values.push({
    //                     //   RefinementCount: (Number)item.RefinementCount,
    //                     RefinementCount:Number(item.RefinementCount),
    //                     // RefinementName:  this._formatDate(item.RefinementName), //This value will appear in the selected filter bar
    //                     RefinementName:  item.RefinementName,
    //                     RefinementToken: item.RefinementToken,
    //                     // RefinementValue: this._formatDate(item.RefinementValue), // This value will appear in the filter panel
    //                     RefinementValue: item.RefinementValue // This value will appear in the filter panel
    //                   });
    //               });
        
    //               refinementResults.push({
    //                 //   FilterName: refiner.RefinementName,
    //                   FilterName: refiner.Name,
    //                   Values: values,
    //               });
    //           });
    //         }
    //         const relevantResults: ISearchResult[] = await Promise.all(allItemsPromises);
    //         results.RelevantResults = relevantResults;
    //         results.RefinementResults = refinementResults;
    //         return results;
          
    // }
    
    
    
    // public async searchDev(queryText:string,refinementFilters:string[],manualType:string):Promise<ISearchResults>{
        public async searchDev(queryText:string,refinementFilters:string[],manualType:string):Promise<SearchResults>{
        let results: ISearchResults = {
            PrimarySearchResults : [],
            RelevantResults : [],
            RefinementResults: [],
            TotalRows: 0,
        };
        
        if (manualType== 'undefined') {
            return;
        }

        let searchQuery: SearchQuery = {}; 
        let sortedRefiners: string[] = [];
        let selectPropertyCategory:string = ""
        let filterOnContentType:string="";
        let refinersMappedProperties:string="";
        let searchQueryQueryText:string="";
        let selectProperties:string[];

        selectProperties=['Title','Author',refinersMappedProperties,'Path','ContentType','LBInfo','LBTeaser','HitHighlightedSummary','Gruppe','Undergruppe'];
                
        
        let rf:string[]=[];
        refinersMappedProperties="Gruppe";
        if (refinementFilters.length==1) {
            searchQuery.Querytext="ContentType:Skadehåndbog AND Håndbog:"+ manualType + " AND " + queryText + " " + refinersMappedProperties + ":" + refinementFilters[0];
        }
        else
        {
            searchQuery.Querytext="ContentType:Skadehåndbog AND Håndbog:"+ manualType + " AND " + queryText + " ";    
        }
        console.log(searchQuery.Querytext)
        console.log(refinementFilters)
        
        searchQuery.TrimDuplicates=false;
        searchQuery.SelectProperties=selectProperties;
        searchQuery.Refiners=refinersMappedProperties;
        
        const r = await pnp.sp.search(searchQuery);
        let totalRows: number = r.RawSearchResults.PrimaryQueryResult.RelevantResults.TotalRowsIncludingDuplicates;
        let pageSize = 500; //maximum rows that search api can return

        
        let searchResult:SearchResults[]=[];
        if (totalRows > pageSize) {
            let totalPages = parseInt((totalRows / pageSize).toString());
            let i:number=0;
                   
            while (totalRows - pageSize * i> 0) {
                await r.getPage(i+1,500).then((row)=>{
                    searchResult.push(row)
                    // console.log(row.PrimarySearchResults)
                })    
                i++;    
            }   
       }
       else{
            await r.getPage(1,500).then((row)=>{
                searchResult.push(row)
                // console.log(row.PrimarySearchResults)
            })
       }
       
       const relevantResults: SearchResults[] = await Promise.all(searchResult);

       let finalResults:SearchResults=relevantResults[0];
       let counter=0;
       
       relevantResults.map((el)=>{
           if(counter>0){
            finalResults.PrimarySearchResults.push(...el.PrimarySearchResults)
           }
           counter++;
       })
            // results.RelevantResults = relevantResults;
            // results.RefinementResults = refinementResults;
            
        return finalResults;

       
}

// public async searchWithPaging(startRow):Promise<ISearchResults>{


// }
    
    
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

