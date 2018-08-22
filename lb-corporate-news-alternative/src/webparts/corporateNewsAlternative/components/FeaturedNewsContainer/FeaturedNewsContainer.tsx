import * as React from 'react';
import { escape } from '@microsoft/sp-lodash-subset';
import styles from './FeaturedNewsContainer.module.scss'
import SPSearchService from '../../services/SPSearchService';
import WebPartContext from '@microsoft/sp-webpart-base/lib/core/WebPartContext';

import { Link } from 'office-ui-fabric-react/lib/Link';
import { IFeaturedNewsContainerProps } from './IFeaturedNewsContainerProps';
import NewsItem from '../NewsItem/NewsItem';
export default class FeaturedNewsContainer extends React.Component<IFeaturedNewsContainerProps, {}> {
  

public render(): React.ReactElement<IFeaturedNewsContainerProps> {
  let counter :number=0;
    return (
          <div className={styles.FeaturedNewsContainer}>
            {this.props.featuredNewsList.map((item)=>{
              counter++;
              
              if (counter>1 && counter<5) {

                return (
                  <div className='ms-Grid-row'>
                    
                    <NewsItem documentTitle={item.Title}  previewImageUrl={item.LBNyhedsbillede.Url} documentDescription={item.Teaser} sender={item.Afsender} priority={2} fileRef={item.fileRef}/>
                  </div>
                )
              }
              if (counter>4){
                return (
                  <div className='ms-Grid-row' >
                    <NewsItem documentTitle={item.Title}  previewImageUrl={item.LBNyhedsbillede.Url} documentDescription={item.Teaser} sender={item.Afsender} priority={3} fileRef={item.fileRef}/>
                  </div>
                )
              }
              
            })}
          </div>
      
      
    );
  }
}
