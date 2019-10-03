import * as React from 'react';
import {  IEvaluationRowProps } from './IEvaluationRowProps';
import {  IEvaluationRowState } from './IEvaluationRowState';
import styles from './EvaluationRow.module.scss'
import { escape } from '@microsoft/sp-lodash-subset';
import SPService from "../../services/SPService"
import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
export default class EvaluationRow extends React.Component<IEvaluationRowProps, IEvaluationRowState > {
  public constructor(props:IEvaluationRowProps,state:IEvaluationRowState){  
      super(props);
      this.state= {
                  }
  }
  
  public render(): React.ReactElement<IEvaluationRowProps> {
    return (
      <div className={styles.row}>
        <div className={styles.title}>Priviledged user</div>
        <div>{this.props.employeeInFocusDisplayName}</div>
        <div>
          <Checkbox label={this.props.claimID} >
            </Checkbox> 
        </div>
      </div>
    );
  }
}
