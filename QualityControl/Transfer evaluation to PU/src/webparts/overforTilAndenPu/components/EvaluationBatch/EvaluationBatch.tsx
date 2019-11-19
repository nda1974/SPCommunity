import * as React from 'react';
import{IEvaluationBatchProps} from '../EvaluationBatch/IEvaluationBatchProps'
import{IEvaluationBatchState} from '../EvaluationBatch/IEvaluationBatchState'
import styles from '../EvaluationBatch/EvaluationBatch.module.scss'
import { escape } from '@microsoft/sp-lodash-subset';
import SPService from "../../services/SPService"
import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';
import { Checkbox,ICheckboxProps } from 'office-ui-fabric-react/lib/Checkbox';
import { Item } from '@pnp/sp';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { DefaultButton, IIconProps } from 'office-ui-fabric-react';

const volume0Icon: IIconProps = { iconName: 'Clear' };
const volume3Icon: IIconProps = { iconName: 'Accept' };
export default class EvaluationBatch extends React.Component<IEvaluationBatchProps, IEvaluationBatchState > {
  public constructor(props:IEvaluationBatchProps,state:IEvaluationBatchState){  
      super(props);
      this.state= {
        isBatchSelected:false,
        isBatchPartlyHandled:false,
        showEvaluationsSection:false
                  }
        this._onCheckboxChange = this._onCheckboxChange.bind(this);

                  // const isSubmittedElementsPresent=this.props.evaluationItems.filter(elem=>
                  //   elem.ControlSubmitted==true
                  // )
                  // isSubmittedElementsPresent.length>0?this.setState({isBatchPartlyHandled:true},this.render):null;
  }

  private _onCheckboxChange(ev: React.FormEvent<HTMLElement>, isChecked: boolean): void {
    this.props.checkboxChangedCallBack(this.props.BatchID, isChecked);
  }
  
  // private _onCheckboxChangeORG(ev: React.FormEvent<HTMLElement>, isChecked: boolean): void {
  //   this.props.checkboxChangedCallBack(this.props.BatchID, isChecked);
  // }
  private _toggleEvaluationSection(showEvaluationSection:boolean){
    this.setState({showEvaluationsSection:showEvaluationSection})
  }
  public render(): React.ReactElement<IEvaluationBatchProps> {
    const isSubmittedElementsPresent=this.props.evaluationItems.filter(elem=>
      elem.ControlSubmitted==true
    )
    
    return (
      <div className={styles.evaluationItemRow}>
        {/* Header section */}
        <div className={isSubmittedElementsPresent.length>0?styles.header+' '+styles.header__locked:styles.header}>

          <div className={styles.iconDiv}>
            <Icon iconName="Contact" /> {this.props.employeeInFocusDisplayName}
          </div>
          
          <div className={styles.iconDiv}>
            <Icon iconName="DocumentSet" /> Udtræk {this.props.BatchID}
          
            {
            this.state.showEvaluationsSection==true
            ?<Icon iconName="ChevronUp" className={styles.chevron} onClick={()=>{this._toggleEvaluationSection(false)}} />
            :<Icon iconName="ChevronDown" className={styles.chevron} onClick={()=>{this._toggleEvaluationSection(true)}}/>
            }
          </div>
        </div>
        
        {/* Body Section */}
        <div className={this.state.showEvaluationsSection==true?styles.evaluationsContainer:styles.evaluationsContainer__Hide}>
          {
          this.props.evaluationItems.map(item=>{
            return(
              <div className={styles.evaluationItem}>
                
                <div className={styles.documentIconDiv}>
                  {
                    item.ControlSubmitted==true?<Icon iconName="ProtectedDocument" />
                                                :<Icon iconName="Document" />
                  }
                  {item.ClaimID}
                </div>
              </div>
            )
          })}
        </div>


        {
          isSubmittedElementsPresent.length<1?
          <div className={styles.btnMoveDocumentSetRow}>
            <div className={styles.toggleLabel}>Overfør evalueringer: 
              <Toggle className={styles.btnMoveDocumentSet}
                      inlineLabel 
                      onText=" Ja" 
                      offText="Nej" 
                      onChange={this._onCheckboxChange}
                      id={this.props.BatchID} />
            </div>
          </div>:null
        }
      </div>
      
    );
  }
}
