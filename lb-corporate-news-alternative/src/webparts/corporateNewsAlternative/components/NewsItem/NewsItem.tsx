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
  
  private getSenders(newsItem):string{
  
    let res="";
    newsItem.map((item)=>{
      res=res + item.Title + ", "
    })
    
    return res.slice(0,-2);
  }

public render(): React.ReactElement<INewsItemProps> {
  // const previewProps: IDocumentCardPreviewProps = {
  //   previewImages: [
  //     {
  //       name: this.props.documentTitle,
  //       previewImageSrc: this.props.previewImageUrl,
  //       imageFit: ImageFit.contain,
  //       width: 271,
  //       height: 171
  //     }
  //   ],
  // };
  if(this.props.priority<3){
    return (
      <div className={styles.NewsItem}>
        {/* <Link href={this.props.fileRef}> */}
          <div className={styles.ImageArea}>
                <img src={ this.props.previewImageUrl}/>
          </div>
          <div className={styles.ContentArea}>
              <div className={styles.ContentHeader}><Link href={this.props.fileRef}>{this.props.documentTitle}</Link></div>
              <div>{this.getSenders(this.props.sender)}</div>
              <div className={styles.ContentText}>{this.props.documentDescription}</div>
          </div>
        {/* </Link> */}
      </div>
    );
  }
  else
  {
    return (
      <div className={styles.LowPriorityNews}>
          <Link href={this.props.fileRef}>
              {this.props.documentTitle}
          </Link>
      </div>
    );
  }
  }
}
