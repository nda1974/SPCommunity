import * as React from 'react';
import {  IEvaluationRowProps } from './IEvaluationRowProps';
import {  IEvaluationRowState } from './IEvaluationRowState';
import styles from '../EvaluationRow/EvaluationRow.module.scss'
import { escape } from '@microsoft/sp-lodash-subset';
import SPService from "../../services/SPService"
import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';
import { Checkbox,ICheckboxProps } from 'office-ui-fabric-react/lib/Checkbox';
export default class EvaluationRow extends React.Component<IEvaluationRowProps, IEvaluationRowState > {
  public constructor(props:IEvaluationRowProps,state:IEvaluationRowState){  
      super(props);
      this.state= {
                  }
                  this._onCheckboxChange = this._onCheckboxChange.bind(this);
  }
  private _onCheckboxChange(ev: React.FormEvent<HTMLElement>, isChecked: boolean): void {
    this.props.checkboxChangedCallBack(this.props.ID, isChecked);
  }
  public render(): React.ReactElement<IEvaluationRowProps> {
    return (
      <div className={styles.evaluationItemRow}>

        <div className={styles.header}>
          Skadebehandler: {this.props.employeeInFocusDisplayName}
        </div>

        <div className={styles.checkbox}>
          <div className={styles.subHeader}>
          <Checkbox   onChange={this._onCheckboxChange}
                      label= {`Sagsnr: ${this.props.claimID}`}></Checkbox>
          </div>
        </div>

      </div>
    );
  }
}
