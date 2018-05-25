import pnp ,{setup, ItemAddResult}from "sp-pnp-js";
import * as React from 'react';
import styles from '../Basket/Basket.module.scss'
import { escape } from '@microsoft/sp-lodash-subset';
import { DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { IOrderLine } from '../ProductsContainer/ProductsContainer';
import {
  DetailsList,
  buildColumns,
  IColumn,
  SelectionMode
} from 'office-ui-fabric-react/lib/DetailsList';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image'
import {
  DocumentCard,
  DocumentCardActivity,
  DocumentCardPreview,
  DocumentCardTitle,
  IDocumentCardPreviewProps,
  DocumentCardType
} from 'office-ui-fabric-react/lib/DocumentCard';

import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
import { LayerHost, Layer } from "office-ui-fabric-react/lib/Layer";
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
export interface IBasketProps{
  
  title:string;
  listItems:IOrderLine[];
  removeFromBasket:any;
  
  
}
export interface IBasketState{
  listStateItems:IOrderLine[];
  status: JSX.Element;
  hideDialog:boolean;
}

export default class Basket extends React.Component<IBasketProps, IBasketState> {
  
  public constructor(props:IBasketProps,state:IBasketState){  
        super(props);
      
        this.state= {
                      listStateItems:[],
                      status:<span></span>,
                      hideDialog:true
        }

        setup({
          sp: {
              headers: {
                  Accept: "application/json; odata=nometadata"
              },
              baseUrl:"https://lbforsikring.sharepoint.com/sites/service"
          }
        });
        
        this._checkOut=this._checkOut.bind(this);
        // this._removeFromBasket=this._removeFromBasket.bind(this);
    
      
        
}
// public componentWillReceiveProps(nextProps) {
//   this.setState({
//     listStateItems:nextProps.listItems
//   })

// }
  public render(): React.ReactElement<IBasketProps> {
    try {
      
      const content = (
        <div>
          This is example layer content.
        </div>
      );
      const _columns: IColumn[] = [
        {
          key: 'quantity',
          name: 'Antal',
          fieldName: 'quantity',
          minWidth: 15,
          maxWidth: 50,
          isResizable: true
        },
        {
          key: 'Title',
          name: 'Vare',
          fieldName: 'title',
          minWidth: 150,
          maxWidth: 250,
          isResizable: true
        }
        
      ];
          return (
            <div className={` ${styles.BasketBody}`}  >
            {this.props.listItems.length>0?
              <div className="ms-Grid">
                      <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm6 ms-md8 ms-lg12">
                              <Dialog hidden={ this.state.hideDialog }
                                    onDismiss={ this.redirectMe }
                                    dialogContentProps={ {
                                      type: DialogType.largeHeader,
                                      title: 'Tak for din bestilling',
                                      subText: 'Du vil modtage dine artikler hurtigts muligt.'
                                    } }
                                    modalProps={ {
                                      isBlocking: true,
                                      containerClassName: 'ms-dialogMainOverride'
                                    } }>

                                    <DialogFooter>
                                      <DefaultButton onClick={ this.redirectMe } text='Luk' />
                                    </DialogFooter>
                              </Dialog>
                      
                              <DetailsList
                                items={ this.props.listItems as IOrderLine[] }
                                setKey='set'
                                columns={_columns }      
                                selectionMode={SelectionMode.none}
                                isHeaderVisible={false}
                              />
                        </div>
                      </div>
                      
                      <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6">
                          <DefaultButton
                              text="Bestil"
                              onClick={this._checkOut}
                            >
                            {this.state.status}
                            </DefaultButton>
                            
                        </div>
                        <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6">
                        <DefaultButton
                            text="Slet kurv"
                            onClick={this.props.removeFromBasket}
                          />
                        </div>
                      </div>
              </div>
            :null}
                    
                    
                    
            </div>
          );

          
        } 
    catch (error) {
      console.log(error)
    }
  }

  private _checkOut()
  {
    //this.props.listItems;
    this.props.listItems.map((item)=>{
      this.placeOrder(item.title,item.id,item.quantity);
      
    });
    
    
  } 
  
  private placeOrder(title,varenummer,antal){
    // add an item to the list
    let status: JSX.Element = <Spinner size={SpinnerSize.small}    />;

    this.setState({ status:status });

    pnp.sp.web.lists.getByTitle("Ordreliste").items.add({
      Title: title,
      Varenummer:varenummer,
      Antal:antal
    }).then((iar: ItemAddResult) => {
      console.log(iar);
      status = <span></span>;
      this.setState({ status:status });
      
      this.setState({ hideDialog:false });
      //window.location.href = "https://lbforsikring.sharepoint.com/sites/Service";
      
    });
  }
  private redirectMe(){
    window.location.href = "https://lbforsikring.sharepoint.com/sites/Service";
  }
  
}