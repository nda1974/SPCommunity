import * as React from 'react';
import { escape } from '@microsoft/sp-lodash-subset';
import { DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image'
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Slider } from 'office-ui-fabric-react/lib/Slider';
import {
  DocumentCard,
  DocumentCardActivity,
  DocumentCardPreview,
  DocumentCardTitle,
  IDocumentCardPreviewProps,
  DocumentCardType
} from 'office-ui-fabric-react/lib/DocumentCard';
import { IIconProps } from 'office-ui-fabric-react/lib/Icon';

export interface IProductItemProps{
  
  title:string;
  productNo:string;
  productImageUrl?:string;
  beskrivelse:string;
  addToBasket:any;
  
  
}
export interface IProductItemState{
  quantity:string;
}

export default class ProductItem extends React.Component<IProductItemProps, IProductItemState> {
  
  public constructor(props:IProductItemProps,state:IProductItemState){  
        super(props);
      
        this.state= {
          quantity:"0"
        }

        this._addToBasket=this._addToBasket.bind(this);
        
        
}

  public render(): React.ReactElement<IProductItemProps> {
    try {

      const iconCartProps:IIconProps={
        iconName:'ShoppingCart'
      };
      const previewProps: IDocumentCardPreviewProps = {
        previewImages: [
          {
            name: this.props.title,
            previewImageSrc: this.props.productImageUrl,
            imageFit: ImageFit.cover,
            width: 160,
            height: 140
          }
        ],
      };
          return (

        <div className="ms-Grid-row">
        <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6">
          <DocumentCard type={ DocumentCardType.compact } >
            <DocumentCardPreview  {...previewProps } />
            <div className='ms-DocumentCard-details'>
              <DocumentCardTitle
                title={this.props.title}
                shouldTruncate={ true }
              />
            </div>
          </DocumentCard>
          {/* {this.props.title} */}
          </div>
        
          <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg3">
              <TextField
                  onChanged={(value)=> this._setQuantity({value})}
                  placeholder='Antal.'
                  ariaLabel='Please enter text here'
                  defaultValue='0'
                />
          </div>
          <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg3">
              <DefaultButton
                  data-automation-id='test'
                  text="Tilføj"
                  onClick={this._addToBasket}
                  iconProps={iconCartProps}
                />
          </div>
        </div>
            
          );

          
        } 
    catch (error) {
      console.log(error)
    }
  }
  public _setQuantity(arg){
    this.setState({quantity:arg})
  }
  public _addToBasket()
  {
    if(this.state.quantity != undefined){
      this.props.addToBasket(this.props.title,this.props.productNo, this.state.quantity, this.props.productImageUrl);
    }
    else{
      this.props.addToBasket(this.props.title,this.props.productNo, 0, this.props.productImageUrl);
    }
    
  }
  
}