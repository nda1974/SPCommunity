import pnp ,{setup}from "sp-pnp-js";

import * as React from 'react';
import { escape } from '@microsoft/sp-lodash-subset';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import TickerItem from '../TickerItem/TickerItem'
import { LayerHost } from "office-ui-fabric-react/lib/Layer";
export interface IAppProps{
  
  description:string;
  
}
export interface IAppState{
  listItems:any[];
  time:Date;
  author?:string;
  
}

export default class App extends React.Component<IAppProps, IAppState> {
  // private _getTime (inputDate:Date):any {      
    
  //   var localTime = inputDate.getTime();       
  //   var localOffset=inputDate.getTimezoneOffset() * 60000;       
  //   var utc = localTime + localOffset;      
  //   var retval = new Date(utc);       
  //   return retval;
  
  // };
  
  public constructor(props:IAppProps,state:IAppState){  
        let interval:any=null;
        let today: Date = new Date();
        //today.setHours(0, 0, 0, 0);
        var offset = new Date().getTimezoneOffset();
        today.setMinutes(today.getMinutes() + offset);

        console.log('public constructor' + today.toISOString());
        super(props);
      
        this.state= {
                      listItems:[],
                      time:null
                    }

                    setup({
                      sp: {
                          headers: {
                              Accept: "application/json; odata=nometadata"
                          },
                          baseUrl:"https://lbforsikring.sharepoint.com/sites/intra"
                      }
                  });
                  
                  //.filter(`Start lt datetime'${today.toISOString()}' and Slut gt datetime'${today.toISOString()}'`)
                  this.fetchSharePointData();
                  // pnp.sp.web.lists.getByTitle("Driftmeddelelser")
                  // .items.select("Title,Active,Severity,Description,Start,Slut").get().then(
                  //   (data:any[])=>{this.setState({listItems:data})}
                  // );
        
}
private fetchSharePointData(){
  pnp.sp.web.lists.getByTitle("Driftmeddelelser")
                  .items.select().orderBy('Severity').getAll().then(
                    (data:any[])=>{this.setState({listItems:data})}
                  );
}
private fetchSharePointDataORG(){
  pnp.sp.web.lists.getByTitle("DevDriftmeddelelser")
                  .items.select("Title,Severity,Description,Start,Slut,Created,Author").orderBy('Severity').get().then(
                    (data:any[])=>{this.setState({listItems:data})}
                  );
}

// public componentDidMount(): void {
//   setInterval(() =>  this.fetchSharePointData(),
//   10000);
// }

  public render(): React.ReactElement<IAppProps> {
    try {
          return (
            <div>
                    {
                          this.state.listItems.map((item)=>{
                          {
                            // var r = this.GetUserName(item.AuthorId).then(res=>{
                            //     return res
                            // })
                                
                            if(new Date(item.Start)< new Date() && new Date(item.Slut)> new Date()){
                                return <TickerItem title={item.Title}  description={item.Description} severity={item.Severity} showInfoPanel={false} created={item.Created} createdBy={item.AuthorId}   />
                            } 
                          }  
                      })
                    }
            </div>
          );

          
        } 
    catch (error) {
      console.log(error)
    }
  }
}
