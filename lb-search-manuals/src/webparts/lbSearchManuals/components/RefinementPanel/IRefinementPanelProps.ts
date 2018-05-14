import { IRefinementFilter, ISearchResult, IRefinementResult } from "../../ISearchResults";

export interface IRefinementPanelProps {
    callbackSetRefinementFilters:any;
    callbackClearRefinementFilters:any;
    // "refinementFilters":string[];
    "refiners":IRefinementResult[];
  }