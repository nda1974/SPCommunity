import {  ISearchResult, IRefinementResult, ISearchResults } from "../../ISearchResults";

export interface IGroupItemsProps {
    searchResults:ISearchResults;
    showItems:boolean;
    groupTitle:string;
  }