import * as React from 'react';
import styles from './FilterPanel.module.scss'
import { IFilterPanelProps } from './IFilterPanelProps'
import { escape } from '@microsoft/sp-lodash-subset';
import pnp, {  setup } from "sp-pnp-js";
import { IFilterPanelState } from './IFilterPanelState';
import { PrimaryButton, DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
export default class FilterPanel extends React.Component<IFilterPanelProps, IFilterPanelState> {
  public constructor(props: IFilterPanelProps,state:IFilterPanelState){  
        super(props);  
          
          this.state = {
                    result:[],
                    keywords:[]
          }

      this.callbackSetRefinementFilters= this.callbackSetRefinementFilters.bind(this)

}

  public render(): React.ReactElement<IFilterPanelProps> {
    return (
        <div className={ styles.container }>
        {
          this.props.filters.map((item)=>{
            return(
              <div className={ styles.row }>
                <div className={ styles.column }> 
                <DefaultButton
                                                
                                                data-automation-id='test'
                                                text={item.Label}
                                                value={item.Label}
                                                onClick={ ()=>this._keywordBtnClicked (item.Label)}
                                                /> 
                    
                </div>
              </div>
            )
          })
        } 
        </div>
    );
  }

  private callbackSetRefinementFilters(newState):void {
    // this.setState({ refinementFilters: newState })
  }
  private _keywordBtnClicked(keyword?:string):void{
    this.props.callbackSetKeywordFilters(keyword);    
  }
}
