import * as React from 'react';
import styles from './App.module.scss';
import { IAppProps } from './IAppProps';
import { escape } from '@microsoft/sp-lodash-subset';
import SPSearchService from '../../services/SPSearchService';
import { ISearchResults } from '../../ISearchResults';
import SearchResultContainer from '../SearchResultContainer/SearchResultContainer';
import { IAppState } from './IAppState';
import SearchInputContainer from '../SearchInputContainer/SearchInputContainer';

export default class App extends React.Component<IAppProps, IAppState> {
  public constructor(props: IAppProps,state:IAppState){  
        super(props);  

        this.state = {
                    refinementFilters:[],
                    queryText:'',
                    results: { 
                        RefinementResults: [], 
                        RelevantResults: [] 
                        }
                    };  

                this.GetSharePointData();
                
  }
  
  public GetSharePointData(){
    if(this.props.terms==undefined)
    {
      return;
    }
    let filter:string = this.props.terms.length>0?this.props.terms[0].name:"";
    let queryString:string = this.state.queryText.length>0?this.state.queryText:"*";
    let filterArr=[filter];
    let ss: SPSearchService=new SPSearchService(this.props.webPartContext)
    // let searchResult:Promise<ISearchResults>=ss.search(this.state.queryText + ' ' + this.props.searchUrl,this.state.refinementFilters,this.props.manualType);
    let searchResult:Promise<ISearchResults>=ss.search(queryString,filterArr,'Police håndbog');
    
    let results: ISearchResults = {
        RelevantResults : [],
        RefinementResults: [],
        TotalRows: 0,
    };

    searchResult.then(
        (data:ISearchResults)=>{this.setState({results:data})}

    );
  }          
  public onQueryTextChanged(newState?:string) {
        
    this.setState({ queryText: newState },()=>this.GetSharePointData())
    
    
}
  public render(): React.ReactElement<IAppProps> {
    let term:string= this.props.terms!=undefined?this.props.terms[0].name:"";
    return (
      
      <div className={ styles.app }>
        <div className={ styles.container }>
          <div className={ styles.row }>
          
          <SearchInputContainer callbackSetAppContainerQueryString={(newState) => this.onQueryTextChanged(newState) }/>

          <SearchResultContainer results={this.state.results.RelevantResults} filterGroup={term} />
            {/* <div className={ styles.column }>
              
              
              
            </div> */}
          </div>
        </div>
      </div>
    );
  }
}
