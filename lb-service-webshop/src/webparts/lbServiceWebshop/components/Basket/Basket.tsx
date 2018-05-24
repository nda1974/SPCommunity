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
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
import { LayerHost, Layer } from "office-ui-fabric-react/lib/Layer";
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
export interface IBasketProps{
  
  title:string;
  listItems:IOrderLine[];
  
}
export interface IBasketState{
  listItems:IOrderLine[];
  status: JSX.Element;
  hideDialog:boolean;
}

export default class Basket extends React.Component<IBasketProps, IBasketState> {
  
  public constructor(props:IBasketProps,state:IBasketState){  
        super(props);
      
        this.state= {
                      listItems:[],
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
        
}

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
                    <br/>
                    <hr/>
                    <br/>
                    <DefaultButton
                      data-automation-id='test'
                      text="Bestil"
                      onClick={this._checkOut}
                    >
                    {this.state.status}
                    </DefaultButton>
                    
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