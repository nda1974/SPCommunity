import * as React from 'react';
import styles from './App.module.scss';
import { IAppProps } from './IAppProps';
import { escape } from '@microsoft/sp-lodash-subset';
import SPSearchService from '../../services/SPSearchService';
import { ISearchResults } from '../../ISearchResults';
import SearchResultContainer from '../SearchResultContainer/SearchResultContainer';
import { IAppState } from './IAppState';
import SearchInputContainer from '../SearchInputContainer/SearchInputContainer';
import Groupbar from '../Groupbar/Groupbar';
import Groupbars from '../Groupbars/Groupbars';

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
    //ORG let searchResult:Promise<ISearchResults>=ss.search(queryString,filterArr,'Police håndbog');
    
    
    let searchResult:Promise<ISearchResults>=ss.search(queryString,filterArr,'Police håndbog');
    
    
    
    let results: ISearchResults = {
        RelevantResults : [],
        RefinementResults: [],
        TotalRows: 0,
    };

    // ORG
    // searchResult.then(
    //     (data:ISearchResults)=>{this.setState({results:data})}

    // );


    let filteredResults: ISearchResults = {
      RelevantResults : [],
      RefinementResults: [],
      TotalRows: 0,
    };
    
    searchResult.then((data:ISearchResults)=>{
      
      data.RelevantResults.map((row)=>{
        if(row["PoliceManualGroup"].length>0){
            if(row["PoliceManualGroup"].indexOf(';') > -1)
            {
                let subGroup = row["PoliceManualGroup"].split(';')
                subGroup.map((group)=>{
                    // if(group==refinementFilters[0])
                    if(group=="Ulykke")
                    {
                        filteredResults.RelevantResults.push(row)
                    }
                });
            }
            else{
              if(row["PoliceManualGroup"]=="Ulykke")
              {
                  filteredResults.RelevantResults.push(row)
              }
            }
        }
    }
    );
    filteredResults.RefinementResults=data.RefinementResults;
    this.setState({results:filteredResults})
    })
    
  }          
  private _isGroupSelectedInTermPicker(t:string):boolean{
    
    this.props.terms.map((term)=>{
      if(term.name == t){
        return true;
      }
    })
    return false
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
          {
            this.state.results.RefinementResults.length>0?
            this.state.results.RefinementResults[0].Values.sort((a,b)=>a.RefinementValue.localeCompare(b.RefinementValue )).map((refiners)=>{
              return (<Groupbars searchResults={this.state.results} title={refiners.RefinementValue} />)
            }):null
          }
          </div>
        </div>
      </div>
    );
  }
}
