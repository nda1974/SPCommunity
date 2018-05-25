import pnp ,{setup}from "sp-pnp-js";

import * as React from 'react';
import { escape } from '@microsoft/sp-lodash-subset';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

import { LayerHost } from "office-ui-fabric-react/lib/Layer";
import ProductItem from '../ProductItem/ProductItem'
import Basket from '../Basket/Basket'

export interface IProductsContainerProps{
  products:any[];
}
export interface IProductsContainerState{
  // listItems:any[];
  basketItems:IOrderLine[];

}
export interface IOrderLine{
  title:string;
  quantity:string;
  id:string;
  productImageUrl:string;
}

export default class ProductsContainer extends React.Component<IProductsContainerProps, IProductsContainerState> {
  
  
  public constructor(props:IProductsContainerProps,state:IProductsContainerState){  
        super(props);
        this.state = {  
          // listItems:[],
          basketItems:[]
    };  
    this._addToBasket=this._addToBasket.bind(this);
    this._removeFromBasket=this._removeFromBasket.bind(this);
}

public componentWillReceiveProps(nextProps) {
  // this.setState({
  //   listStateItems:nextProps.listItems
  // })
  let c:string="";
}


  public render(): React.ReactElement<IProductsContainerProps> {
    try {
          return (
            
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-sm8 ms-md8 ms-lg8"> 
                  <div className="ms-Grid">
                    
                        {
                              this.props.products.map((item)=>{
                              {
                                let pic:string='';
                                pic=item.Produktbillede==null?'':item.Produktbillede.Url;
                                    return  <ProductItem   addToBasket={this._addToBasket} productNo={item.Varenummer} title={item.Title} productImageUrl={pic} beskrivelse={item.Beskrivelse} ></ProductItem>
                              }  
                          })}
                    
                  </div>
              </div>

              <div className="ms-Grid-col ms-sm4 ms-md4 ms-lg4"> 
                <Basket title='Kurven' listItems={this.state.basketItems} removeFromBasket={this._removeFromBasket}   />      
              </div>
            </div>
          );

          
        } 
    catch (error) {
      console.log(error)
    }
  }
  public _addToBasket(title,id,amount,productImageUrl){
    let arr:string[]=[];
    let a = this.state.basketItems.slice(); //creates the clone of the state
    
    let orderLine: IOrderLine={title:'',id:'',quantity:'',productImageUrl:''};
    orderLine.title =title;
    orderLine.quantity =amount.value;
    orderLine.id=id;
    orderLine.productImageUrl=productImageUrl;
    // a.push({itemName:title,quantity:amount,id:id});
    a.push(orderLine);
    this.setState({basketItems: a});
  }
  public _removeFromBasket(title,id,amount,productImageUrl){
    let arr:string[]=[];
    let a = this.state.basketItems.slice(); //creates the clone of the state
    
    a.length=0;
    this.setState({basketItems: a});
  }
}