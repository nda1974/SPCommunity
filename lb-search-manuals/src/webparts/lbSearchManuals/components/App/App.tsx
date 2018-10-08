import * as React from 'react';
import { escape } from '@microsoft/sp-lodash-subset';
import WebPartContext from '@microsoft/sp-webpart-base/lib/core/WebPartContext';
import { ISearchResults } from '../../ISearchResults'
import SPSearchService from '../../services/SPSearchService';
import SearchInputContainer from '../SearchInputContainer/SearchInputContainer';
import SearchResultContainer from '../SearchResultContainer/SearchResultContainer';
import RefinementPanel from '../RefinementPanel/RefinementPanel'



export interface IAppProps {
    manualType: string;
    webPartContext:WebPartContext;
    searchUrl:string;
  }

  export interface IAppState {
    "compactMode":boolean,
    "queryText":string,
    "refinementFilters":string[],
    "results":ISearchResults
  }
  
export default class App extends React.Component<IAppProps, IAppState> {
    public constructor(props: IAppProps, state: IAppState){  
            super(props);  
            // this.wpContext=webPartCtx;

            this.state = {
                        refinementFilters:[],
                        queryText:'',
                        compactMode:false,
                        results: { 
                            RefinementResults: [], 
                            RelevantResults: [] 
                            }
                        };  

        
                    // this.handler = this.handler.bind(this)
                    // this.onChildChanged= this.onChildChanged.bind(this)
                    this.onQueryTextChanged= this.onQueryTextChanged.bind(this);
                    this.onRefinementFiltersChanged= this.onRefinementFiltersChanged.bind(this);
                    this.onDisplayModeChanged= this.onDisplayModeChanged.bind(this);

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
    
    onDisplayModeChanged(newState:boolean) {
        this.setState({ compactMode: newState })
        console.log(this.state.compactMode);
        
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
            
    public GetSharePointData(){
        let ss: SPSearchService=new SPSearchService(this.props.webPartContext)
        let searchResult:Promise<ISearchResults>=ss.search(this.state.queryText + ' ' + this.props.searchUrl,this.state.refinementFilters,this.props.manualType);
        
        let results: ISearchResults = {
            RelevantResults : [],
            RefinementResults: [],
            TotalRows: 0,
        };

        searchResult.then(
            (data:ISearchResults)=>{this.setState({results:data})}

        );
    }          
    
        public render(): React.ReactElement<IAppProps> {
            
            if(this.props.manualType==undefined){
                return(<div>Rediger webparten ved at vælge håndbogstype..
                    
                </div>);
            }

            // let ss: SPSearchService=new SPSearchService(this.props.webPartContext)
            
                

            // let searchResult:Promise<ISearchResults>=ss.search(this.state.queryText + ' ' + this.props.searchUrl,this.state.refinementFilters,this.props.manualType);
            
            // let results: ISearchResults = {
            //     RelevantResults : [],
            //     RefinementResults: [],
            //     TotalRows: 0,
            // };

            // searchResult.then(
            //     (data:ISearchResults)=>{this.setState({results:data})}

            // );
            
            return (
                <div className="ms-Grid">    
              
                <div className="ms-Grid-row">
                
                    <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12">
                        <SearchInputContainer   callbackDisplayMode={(newState) => this.onDisplayModeChanged(newState)} 
                                                callbackSetAppContainerQueryString={(newState) => this.onQueryTextChanged(newState) }/>
                                                <br/><br/>
                    </div>
                
                
                </div>
              
                
                <div className="ms-Grid-row">
                    {/* <div className="ms-Grid-col ms-sm6">       
                        <RefinementPanel    refiners={this.state.results.RefinementResults}  
                                            callbackSetRefinementFilters={(newState) => this.onRefinementFiltersChanged(newState) }
                                            callbackClearRefinementFilters={() => this.onRefinementFiltersChanged(null) }/>
                    </div> */}

                    <div className="ms-Grid-col ms-sm12">
                        <SearchResultContainer  results={this.state.results.RelevantResults} 
                                                showCompactMode={this.state.compactMode} />
                    </div>
                
                </div>
                                    
                    {/* <p>Querytext state {this.state.queryText}</p>
                    <p>DisplayMode state {this.state.compactMode}</p> */}
            </div>
            );
        }
}
