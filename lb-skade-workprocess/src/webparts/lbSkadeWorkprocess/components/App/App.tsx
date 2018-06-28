import * as React from 'react';
import { escape } from '@microsoft/sp-lodash-subset';
import WebPartContext from '@microsoft/sp-webpart-base/lib/core/WebPartContext';
import { ISearchResults } from '../../ISearchResults'
import SPSearchService from '../../services/SPSearchService';
// import SearchInputContainer from '../SearchInputContainer/SearchInputContainer';
import SearchResultContainer from '../SearchResultContainer/SearchResultContainer';
import RefinementPanel from '../RefinementPanel/RefinementPanel'
import ProcessMap from '../ProcessMap/ProcessMap';
import SearchInputContainer from '../SearchInputContainer/SearchInputContainer';
import styles from './App.module.scss'


export interface IAppProps {
    manualType: string;
    webPartContext:WebPartContext;
    searchUrl:string;
  }

  export interface IAppState {
    queryText:string;
    refinementFilters:string[];
    results:ISearchResults;
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





            this.fetchSharePointData=this.fetchSharePointData.bind(this)
            this.fetchSharePointData()
            
    }
                
    onQueryTextChanged(newState?:string) {
        
        this.setState({ queryText: newState },function(){
            this.fetchSharePointData()
        })
        
    }
    
    
    
    
    onRefinementFiltersChanged(refinementToken?:string,refinemantString?:string,toggle?:boolean) {
        if (refinementToken==null) {
            let filters:string[]=this.state.refinementFilters;
            filters=[];
            this.setState({ refinementFilters: filters },function(){
                this.fetchSharePointData()
            })        
        } else {
            var a= this.state.refinementFilters.slice()
            if (toggle==true) {
                a.map((item,key)=>{
                    if (item==refinementToken) {
                        a.splice(key,1)
                    }
                })
            }
            else{
                a.push(refinementToken)
            }
            
            this.setState({refinementFilters: a },function(){
                this.fetchSharePointData()
            }) 
              
    }
   
    }
    fetchSharePointData(){
        let ss: SPSearchService=new SPSearchService(this.props.webPartContext)
        let qString:string="";
        let v:string="";
        this.state.refinementFilters.map((f)=>{
            // v=f.replace('"','')
            // v=f.replace(/\"/g, '');
            qString=qString+ `Process:${f}` + " AND "
        })
        // let searchResult:Promise<ISearchResults>=ss.search(this.state.queryText + ' ' + this.props.searchUrl,this.state.refinementFilters,this.props.manualType);
        // let searchResult:Promise<ISearchResults>=ss.search(this.state.queryText + ' ' + "Process=ǂǂ416c706861" + this.props.searchUrl,[],this.props.manualType);
        let searchResult:Promise<ISearchResults>=ss.search(this.state.queryText + ' ' + qString + this.props.searchUrl,[],this.props.manualType);
        
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
    setAreaFilter(areaFilter)
    {
        let qText:string="";
        if (!areaFilter || areaFilter=='Alle') {
            qText="";
        }
        else{
            qText="Målgruppe:"+areaFilter;
        }
        console.log("areaFilter: " + qText)
        this.setState({queryText:qText},()=>{
            console.log("queryText: " + this.state.queryText)
            this.fetchSharePointData();
        })
        
        
        // console.log(areaFilter)
    }
    public render(): React.ReactElement<IAppProps> {
       
        return (
            <div className="ms-Grid">    
            <div className={styles.row}>
                <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12">
                    <SearchInputContainer callbackSetAppContainerQueryString={(newState) => this.onQueryTextChanged(newState) }/>
                    <br/>
                </div>
            </div>

            <div className="ms-Grid-row">
            {
                this.state.results.RefinementResults.map((refinementResults)=>{
                    if (refinementResults.FilterName=="Målgruppe") {
                        return(
                            <div>
                                <ProcessMap mapItems={this.state.results.RefinementResults[1]} setAreaFilter={(areaFilter) => this.setAreaFilter(areaFilter) } />
                                <br/>
                            </div>
                        )                
                    }
                    else{
                        return (
                            null
                        )
                    }
                })
            }
            </div>

                <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-md8">
                        <SearchResultContainer  results={this.state.results.RelevantResults} />
                    </div>
                    {
                        this.state.results.RefinementResults.map((refinementResult)=>{
                            if (refinementResult.FilterName=="Process") {
                            return(
                                <div className="ms-Grid-col ms-md4">
                                    <RefinementPanel selectedRefiners={this.state.refinementFilters} myRefiners={refinementResult} refiners={this.state.results.RefinementResults}  
                                                    callbackSetRefinementFilters={(newState,toggle) => this.onRefinementFiltersChanged(newState,toggle) }
                                                    callbackClearRefinementFilters={() => this.onRefinementFiltersChanged(null) }/>
                                                    <div>{this.state.refinementFilters}</div>
                                </div>
                                )
                            }
                        })
                    }
                <div>
                  
                    
                    </div>
                
                </div>
        </div>
        );
    }
}
