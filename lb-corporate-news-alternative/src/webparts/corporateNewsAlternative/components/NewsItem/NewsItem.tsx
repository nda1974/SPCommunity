import * as React from 'react';
import { escape } from '@microsoft/sp-lodash-subset';
import { INewsItemProps } from './INewsItemProps';
import styles from './NewsItem.module.scss'
import SPSearchService from '../../services/SPSearchService';
import WebPartContext from '@microsoft/sp-webpart-base/lib/core/WebPartContext';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image'
import {
  DocumentCard,
  DocumentCardActivity,
  DocumentCardPreview,
  DocumentCardTitle,
  IDocumentCardPreviewProps,
  DocumentCardType
} from 'office-ui-fabric-react/lib/DocumentCard';
import { Link } from 'office-ui-fabric-react/lib/Link';
export default class NewsItem extends React.Component<INewsItemProps, {}> {
  

public render(): React.ReactElement<INewsItemProps> {
  const previewProps: IDocumentCardPreviewProps = {
    previewImages: [
      {
        name: this.props.documentTitle,
        previewImageSrc: this.props.previewImageUrl,
        imageFit: ImageFit.contain,
        width: 271,
        height: 171
      }
    ],
  };
    return (
      <div className={styles.Item}>
      
        <div>
          <div className="ImagePlaceholderContainer">
              <div className={styles.ImagePlaceholder}>
                <img src={ this.props.previewImageUrl}/>
              </div>
          </div>

          <div className={styles.ItemInfo}>
            
              {this.props.documentTitle}
              
          </div>
            <div className={styles.ItemSender}>
              {this.props.sender}
            </div>
            <div>
              {this.props.documentDescription}
            </div>
          </div>
          
        
          
        
        </div>
      
    );
  }
}
