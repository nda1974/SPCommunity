import { IRefinementFilter, ISearchResult, IRefinementResult } from "../../ISearchResults";

export interface IRefinementPanelProps {
    callbackSetRefinementFilters:any;
    callbackClearRefinementFilters:any;
    // "refiners":string[];
    refiners:IRefinementResult[];
    myRefiners?:IRefinementResult;
}
export interface myRefiners{
    filterName:string;
    values:any[];
}