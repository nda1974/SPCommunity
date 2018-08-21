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
  
    return (
          <div className='ms-Grid-col'>
            {this.props.featuredNewsList.map((item)=>{
              return (
                <div className='ms-Grid-row'>
                <NewsItem documentTitle={item.Title} previewImageUrl='https://lbforsikring.sharepoint.com/sites/Intra/SiteAssets/Nyheder/Acubiz.png?csf=1&e=Mw2owT' documentDescription={item.Teaser} sender=''/>
                </div>
              )
            })}
          </div>
      
      
    );
  }
}
