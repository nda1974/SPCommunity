import * as React from 'react';
import { escape } from '@microsoft/sp-lodash-subset';
import { DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image'
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import styles from './Items.module.scss';
import {
  DocumentCard,
  DocumentCardActivity,
  DocumentCardPreview,
  DocumentCardTitle,
  IDocumentCardPreviewProps,
  DocumentCardType
} from 'office-ui-fabric-react/lib/DocumentCard';
import { IIconProps } from 'office-ui-fabric-react/lib/Icon';

export interface IItemsProps{
  
  name:string;
  department:string;
  imageUrl?:string;
  event:string;
  eventDate:string;
  
}


export default class Items extends React.Component<IItemsProps, {}> {
  
  public constructor(props:IItemsProps,{}){  
        super(props);
  }

  public render(): React.ReactElement<IItemsProps> {
    try {
      const previewProps: IDocumentCardPreviewProps = {
        previewImages: [
          {
            name: this.props.name,
            previewImageSrc: this.props.imageUrl,
            imageFit: ImageFit.cover,
            width: 122,
            height: 122
          }
        ],
      };
          return (

        <div className="ms-Grid-row">
        <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg12">
          <DocumentCard type={ DocumentCardType.compact } >
            <DocumentCardPreview  {...previewProps } />
          

            <div className='ms-DocumentCard-details'>
              <DocumentCardTitle
                title={this.props.name}
                shouldTruncate={ true }
                />
              <div className={styles.details}>
                <div>{this.props.event}</div>
                <div>{this.props.department}</div>
                <div>{this.props.eventDate}</div>
              </div>
              
            </div>
            
          </DocumentCard> 
          
          
        </div>
        </div>
            
          );

          
        } 
    catch (error) {
      console.log(error)
    }
  }
  
  
}