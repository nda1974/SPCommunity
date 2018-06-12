import * as React from 'react';
import styles from './LbCorporateNews.module.scss';
import { ILbCorporateNewsProps } from './ILbCorporateNewsProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class LbCorporateNews extends React.Component<ILbCorporateNewsProps, {}> {
  public render(): React.ReactElement<ILbCorporateNewsProps> {
    return (
      <div className={ styles.lbCorporateNews }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
