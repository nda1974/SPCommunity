import pnp ,{setup}from "sp-pnp-js";

import * as React from 'react';
import { escape } from '@microsoft/sp-lodash-subset';
import ProductsContainer from '../ProductsContainer/ProductsContainer'
import Basket from '../Basket/Basket'
import FilterContainer from '../FilterContainer/FilterContainer'

export interface IAppProps{
  
  description:string;

}
export interface IAppState{
  listItems:any[];
  
}

export default class App extends React.Component<IAppProps, IAppState> {
  
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
                          baseUrl:"https://lbforsikring.sharepoint.com/sites/service"
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
  pnp.sp.web.lists.getByTitle("Produkter")
                  .items.select("Title,Varegruppe,Varenummer,Produktbillede,Beskrivelse").getAll().then(
                    
                    (data:any[])=>{
                      console.log(data)
                      this.setState({listItems:data})
                    }
                  );
}


  public render(): React.ReactElement<IAppProps> {
    try {
          return (
            <div className="ms-Grid">
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12">
                  {/* <FilterContainer listItems={this.state.listItems}/> */}
                  <ProductsContainer products={this.state.listItems} />
                </div>
              </div>
            </div>
            
          );

          
        } 
    catch (error) {
      console.log(error)
    }
  }
}