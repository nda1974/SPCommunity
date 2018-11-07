import { ISearchResults } from "../../ISearchResults";

export interface IAppState {
  
  "queryText":string,
  "refinementFilters":string[],
  "results":ISearchResults
}