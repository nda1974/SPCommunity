import * as React from 'react';
import { escape } from '@microsoft/sp-lodash-subset';
import WebPartContext from '@microsoft/sp-webpart-base/lib/core/WebPartContext';
import { ISearchResults } from '../../ISearchResults'
import SPSearchService from '../../services/SPSearchService';
// import SearchInputContainer from '../SearchInputContainer/SearchInputContainer';
import SearchResultContainer from '../SearchResultContainer/SearchResultContainer';
import RefinementPanel from '../RefinementPanel/RefinementPanel'



export interface IAppProps {
    manualType: string;
    webPartContext:WebPartContext;
    searchUrl:string;
  }

  export interface IAppState {
    queryText:string,
    refinementFilters:string[],
    results:ISearchResults
  }
  
export default class App extends React.Component<IAppProps, IAppState> {
    public constructor(props: IAppProps, state: IAppState){  
            super(props);  
            // this.wpContext=webPartCtx;

            this.state = {
                        refinementFilters:[],
                        queryText:'',
                        results: { 
                            RefinementResults: [], 
                            RelevantResults: [] 
                            }
                        };  

            this.onQueryTextChanged= this.onQueryTextChanged.bind(this);
            this.onRefinementFiltersChanged= this.onRefinementFiltersChanged.bind(this);

            let ss: SPSearchService=new SPSearchService(this.props.webPartContext)
            let searchResult:Promise<ISearchResults>=ss.search(this.state.queryText + ' ' + this.props.searchUrl,this.state.refinementFilters,this.props.manualType);
            
            let results: ISearchResults = {
                RelevantResults : [],
                RefinementResults: [],
                TotalRows: 0,
            };

            searchResult.then(
                (data:ISearchResults)=> {
                                            this.setState({results:data})
                                            
                                            console.log(data)
                                        }

            );
    }
                

    onQueryTextChanged(newState?:string) {
        
        // this.setState({ queryText: newState })
    }
    
    
    
    onRefinementFiltersChanged(newState?:string) {
        if (newState==null) {
            let filters:string[]=this.state.refinementFilters;
            filters=[];
            this.setState({ refinementFilters: filters })        
        } else {
            let filters:string[]=[];
            filters.push(newState)
            this.setState({ refinementFilters: filters })   
            
        }
    }

              
    
    public render(): React.ReactElement<IAppProps> {
        return (
            <div className="ms-Grid">    
                <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-sm4">
                        <SearchResultContainer  results={this.state.results.RelevantResults} />
                    </div>
                    {
                        this.state.results.RefinementResults.map((refinementResult)=>{
                            return(
                                <div className="ms-Grid-col ms-sm4">
                                    <RefinementPanel myRefiners={refinementResult} refiners={this.state.results.RefinementResults}  
                                                    callbackSetRefinementFilters={(newState) => this.onRefinementFiltersChanged(newState) }
                                                    callbackClearRefinementFilters={() => this.onRefinementFiltersChanged(null) }/>
                                </div>
                            )
                        })
                    }
                <p>refinementFilters state {this.state.refinementFilters}</p>
                </div>
                {/* <p>Querytext state {this.state.queryText}</p>
                <p>DisplayMode state {this.state.compactMode}</p> */}
        </div>
        );
    }
}
