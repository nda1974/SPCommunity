import * as React from 'react';
import styles from './App.module.scss'
import { IAppProps } from './IAppProps'
import { escape } from '@microsoft/sp-lodash-subset';
import pnp, {  setup } from "sp-pnp-js";
import { IAppState } from './IAppState';
import FilterPanel from '../FilterPanel/FilterPanel'
import ManualsPanel from '../ManualsPanel/ManualsPanel'
export default class LbEmployeeManual extends React.Component<IAppProps, IAppState> {
  public constructor(props: IAppProps,state:IAppState){  
        super(props);  
          setup({
            sp: {
                headers: {
                    Accept: "application/json; odata=nometadata"
                },
                baseUrl:"https://lbforsikring.sharepoint.com/sites/hr"
            },
          });

          this.state = {
                    manuals:[],
                    keywords:[],
                    filter:[]
          }
          this.callbackSetFilter= this.callbackSetFilter.bind(this);
          this.fetchSharePointData();
}
private removeDuplicates(myArr, prop) {
  return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
}

private fetchSharePointData(){
 
  var manuals:any[]=[];
  var keywords:any[]=[];
  var terms:any[]=[]
   pnp.sp.web.lists.getByTitle("Webstedssider")
              .items
              .filter("ContentType eq 'Medarbejderhåndbog'")
              .get().then(
                (data:any[])=>{

                 console.log(data) 
                 data.map((manual)=>{
                   manuals.push(manual)
                    if(manual.MedarbejdermanualKeyword!= null)
                    {
                      terms=manual.MedarbejdermanualKeyword;
                      terms.map((t)=>{
                        // console.log(t)     
                        keywords.push(t);
                      })
                              
                    }
                    
                 })
                 console.log(keywords) 
                //  let unique =new Set(keywords)
                //  let uniqueKeywords =[...keywords]
                 let uniqueKeywords =this.removeDuplicates(keywords,'Label')
                 console.log(uniqueKeywords) 
                  this.setState({ 'keywords':uniqueKeywords,
                                  'manuals':manuals });

                }
              );
}  
  public render(): React.ReactElement<IAppProps> {
    return (
      <div className={ styles.app }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            
            
            <div className={ styles.column }>
              <FilterPanel filters={this.state.keywords} callbackSetKeywordFilters={this.callbackSetFilter} />
            </div> 
            <div className={ styles.column }>
              <ManualsPanel manuals={this.state.manuals} filter={this.state.filter}  />
            </div>
          </div> 


        </div>
      </div>
    );
  }
  public callbackSetFilter(keyword)
  {
    var arr= this.state.filter;
    this.setState({'filter':arr})
    console.log(keyword)
  }
}
