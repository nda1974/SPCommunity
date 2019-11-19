import * as React from 'react';
import {  IUpdateDialogProps } from './IUpdateDialogProps';
import {  IUpdateDialogState } from './IUpdateDialogState';
import styles from '../EvaluationRow/EvaluationRow.module.scss'
import { escape } from '@microsoft/sp-lodash-subset';
import SPService from "../../services/SPService"
import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';
import { Checkbox,ICheckboxProps } from 'office-ui-fabric-react/lib/Checkbox';
export default class UpdateDialog extends React.Component<IUpdateDialogProps, IUpdateDialogState > {
  public constructor(props:IUpdateDialogProps,state:IUpdateDialogState){  
      super(props);
      this.state= {
                  }
                  
  }
  
  public render(): React.ReactElement<IUpdateDialogProps> {
    
    return (
      <div className={styles.container}>

        <div className={styles.header}>
          Skadebehandler: {this.props.dialogMessage}
        </div>

      </div>
    );
  }
}
