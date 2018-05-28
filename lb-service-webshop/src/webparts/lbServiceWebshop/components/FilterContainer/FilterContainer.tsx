import pnp ,{setup}from "sp-pnp-js";

import * as React from 'react';
import { escape, set } from '@microsoft/sp-lodash-subset';
import ProductsContainer from '../ProductsContainer/ProductsContainer'
import Basket from '../Basket/Basket'

export interface IFilterContainerProps{
  
  listItems:any[];

}


export default class ApFilterContainerp extends React.Component<IFilterContainerProps,{}> {
  
  public constructor(props:IFilterContainerProps,{}){  
        super(props);
        this.state= {
                    }
}



  public render(): React.ReactElement<IFilterContainerProps> {
    try {
      let filters:string[]=[];
          {this.props.listItems.map((item)=>{
            filters.push(item.varegruppe)
          })}
          // const uniqueValues = new Set(filters);
          let a = Array(new Set(filters))
          return (
            <div className="ms-Grid">
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12">
                  {this.props.listItems.map((item)=>{
                    return <div>{item.Varegruppe.Label}</div>
                  })}
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