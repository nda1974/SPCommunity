import * as React from 'react';
import styles from './ManualsPanel.module.scss'
import { IManualsPanelProps } from './IManualsPanelProps'
import { escape } from '@microsoft/sp-lodash-subset';
import pnp, {  setup } from "sp-pnp-js";
import { IManualsPanelState } from './IManualsPanelState';
import { PrimaryButton, DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';

export default class ManualsPanel extends React.Component<IManualsPanelProps, IManualsPanelState> {
  public constructor(props: IManualsPanelProps,state:IManualsPanelState){  
        super(props);  
          
          this.state = {
                    result:[],
                    keywords:[]
          }

}

  public render(): React.ReactElement<IManualsPanelProps> {
    return (
        <div className={ styles.container }>
        {
          this.props.manuals.map((item)=>{
            return(
              <div className={ styles.row }>
                <div className={ styles.column }> 
                <h2>{item.Title }</h2>
                <div className={ styles.row }>
                {item.Description }
                </div>    
                </div>
              </div>
            )
          })
        } 
        </div>
    );
  }
}
