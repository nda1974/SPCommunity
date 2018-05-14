import { ISearchResults } from "../../ISearchResults";

export interface IMainAppState {
    "compactMode":boolean,
    "queryText":string,
    "refinementFilters":string[],
    "results":ISearchResults
  }