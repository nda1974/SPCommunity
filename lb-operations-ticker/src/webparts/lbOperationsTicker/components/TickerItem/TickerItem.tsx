import * as React from 'react';
import styles from './TickerItem.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';


export interface ITickerItemProps {
  description: string;
}

export default class TickerItem extends React.Component<ITickerItemProps, {}> {
  public constructor(props:ITickerItemProps,{}){  
        super(props);  
        
        
}
  public render(): React.ReactElement<ITickerItemProps> {

    return (
      <div className={ styles.lbNewsticker }>
        <div className="ms-Grid-row">
            {this.props.description}
        </div>
      </div>
    );
  }
}
