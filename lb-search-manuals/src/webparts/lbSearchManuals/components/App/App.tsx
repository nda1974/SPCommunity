import * as React from 'react';
import { escape } from '@microsoft/sp-lodash-subset';
import WebPartContext from '@microsoft/sp-webpart-base/lib/core/WebPartContext';
import { ISearchResults } from '../../ISearchResults'
import SPSearchService from '../../services/SPSearchService';
import SearchInputContainer from '../SearchInputContainer/SearchInputContainer';
import SearchResultContainer from '../SearchResultContainer/SearchResultContainer';
import RefinementPanel from '../RefinementPanel/RefinementPanel'
import { SearchResult, SearchResults } from 'sp-pnp-js';
import { format } from '@uifabric/utilities/lib';



export interface IAppProps {
    manualType: string;
    webPartContext:WebPartContext;
    searchUrl:string;
  }
//ORG
//   export interface IAppState {
//     "compactMode":boolean,
//     "queryText":string,
//     "refinementFilters":string[],
//     "results":ISearchResults
//   }
  
export interface IAppState {
    "queryText":string,
    "refinementFilters":string[],
    "results":SearchResults
  }
export default class App extends React.Component<IAppProps, IAppState> {
    public constructor(props: IAppProps, state: IAppState){  
            super(props);  
            // ORG
        //     this.state = {
        //                 refinementFilters:[],
        //                 queryText:'',
        //                 compactMode:false,
        //                 results: { 
        //                     RefinementResults: [], 
        //                     RelevantResults: [] 
        //                     }
        //                 };  

            this.state = {
            refinementFilters:[],
            queryText:'',
            results: null
            };
        
                    // this.handler = this.handler.bind(this)
                    // this.onChildChanged= this.onChildChanged.bind(this)
                    this.onQueryTextChanged= this.onQueryTextChanged.bind(this);
                    this.onRefinementFiltersChanged= this.onRefinementFiltersChanged.bind(this);
                    

                    // let ss: SPSearchService=new SPSearchService(this.props.webPartContext)
                    // let searchResult:Promise<ISearchResults>=ss.search(this.state.queryText + '*' + this.props.searchUrl,this.state.refinementFilters,this.props.manualType);
                    
                    // let results: ISearchResults = {
                    //     RelevantResults : [],
                    //     RefinementResults: [],
                    //     TotalRows: 0,
                    // };
        
                    // searchResult.then(
                    //     (data:ISearchResults)=>{this.setState({results:data})}
        
                    // );
                    this.GetSharePointData();
                    
    }
                

    public onQueryTextChanged(newState?:string) {
        
        this.setState({ queryText: newState },()=>this.GetSharePointData())
        
        
    }
    
    
    
   public onRefinementFiltersChanged(newState?:string) {
    let filters:string[]=[];    
        if (newState==null) {
            filters=this.state.refinementFilters;
            filters=[];
            //this.setState({ refinementFilters: filters })        
        } else {
            // let filters:string[]=[];
            filters.push(newState)
            // this.setState({ refinementFilters: filters })        
        }
        this.setState({ refinementFilters: filters },()=>this.GetSharePointData())

        // this.GetSharePointData();
        
        
    
    }
            
    public  GetSharePointData(){
        let ss: SPSearchService=new SPSearchService(this.props.webPartContext);
        let qString = this.state.queryText.length>1?"*"+this.state.queryText+"*":'*';
        //ORG let searchResult:Promise<ISearchResults>=ss.search(this.state.queryText + ' ' + this.props.searchUrl,this.state.refinementFilters,this.props.manualType);
        // let searchResult:Promise<ISearchResults>=ss.searchDev(this.state.queryText + ' ' + this.props.searchUrl,this.state.refinementFilters,this.props.manualType);
        let searchResult:Promise<SearchResults>=ss.searchDev(qString + ' ' + this.props.searchUrl,this.state.refinementFilters,this.props.manualType);
        
        // searchResult.then((res)=>{
        //     console.log(res)
        // })
        
        // let results: ISearchResults = {
        //     PrimarySearchResults: [],
        //     RelevantResults : [],
        //     RefinementResults: [],
        //     TotalRows: 0,
        // };

        searchResult.then(
            (data:SearchResults)=>{this.setState({results:data})}

        );
//ORG
        // searchResult.then(
        //     (data:ISearchResults)=>{this.setState({results:data})}

        // );
    }          
    
        public render(): React.ReactElement<IAppProps> {
            
            if(this.props.manualType==undefined){
                return(<div>Rediger webparten ved at vælge håndbogstype..
                    
                </div>);
            }

            
            return (
                <div className="ms-Grid">    
              
                <div className="ms-Grid-row">
                    <SearchInputContainer callbackSetAppContainerQueryString={(newState) => this.onQueryTextChanged(newState) }/>
                                                    <br></br>
                        
                    <SearchResultContainer  results={this.state.results} />
                    
                    
                </div>
            </div>
            );
        }
}
