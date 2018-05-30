import pnp ,{setup}from "sp-pnp-js";
import * as React from 'react';
import styles from './App.module.scss';
import { IAppProps } from './AppProps';
import { IAppState } from './AppState';
import { escape } from '@microsoft/sp-lodash-subset';
import ItemsContainer from '../ItemsContainer/ItemsContainer'
export default class LbHrRundtomlb extends React.Component<IAppProps, IAppState> {
  
  public constructor(props:IAppProps,state:IAppState){  
    super(props);
  
    this.state= {
                  listItems:[]
                }

                setup({
                  sp: {
                      headers: {
                          Accept: "application/json; odata=nometadata"
                      },
                      baseUrl:"https://lbforsikring.sharepoint.com/sites/hr"
                  }
              });
              
              this.fetchSharePointData();
              
    
}

private fetchSharePointData(){
  let d = new Date();
  
  //.filter(`Start lt datetime'${today.toISOString()}' and Slut gt datetime'${today.toISOString()}'`)
  
pnp.sp.web.lists.getByTitle("RundtOmLB")
              .items.select("Kategori,Stilling,Afdeling,Begivenhed,EventDate,FileLeafRef,Startdato,Slutdato")
              .filter(`Kategori eq '${this.props.eventType}' and Startdato le datetime'${d.toISOString()}' and Slutdato gt datetime'${d.toISOString()}'`).get().then(
                (data:any[])=>{this.setState({listItems:data})}
              );
}

  public render(): React.ReactElement<IAppProps> {
    return (
      <div className={ styles.App }>
      <div className={ styles.title }>{this.props.webPartHeader}</div>
        <ItemsContainer listItems={this.state.listItems} />
      </div>
    );
  }
}
