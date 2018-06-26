import * as React from "react";
import * as ReactDom from 'react-dom';
import styles from './RefinementPanel.module.scss'
import { PrimaryButton, DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import {IRefinementFilter} from '../../ISearchResults'
import { IRefinementPanelProps } from "./IRefinementPanelProps";
import { IRefinementPanelState } from "./IRefinementPanelState";
import { SPComponentLoader } from '@microsoft/sp-loader';

export default class RefinementPanel extends React.Component<IRefinementPanelProps, IRefinementPanelState> {
    
    
    public constructor(props:IRefinementPanelProps, state:IRefinementPanelState){  
        super(props);  
        
        this.state = {
                    refinementFilters:[]
                    };  

                this.callbackSetRefinementFilters= this.callbackSetRefinementFilters.bind(this)
}
          
            
            private callbackSetRefinementFilters(newState):void {
            this.setState({ refinementFilters: newState })
            }
            
                public render(): React.ReactElement<IRefinementPanelProps> {  
                    
                    return(
                        <div className="ms-Grid">
                            {this.props.myRefiners.Values.map((item,key)=>(  
                                <div className="ms-Grid-row">           
                                    <div  className="ms-Grid-col ms-sm12 ms-md12 ms-lg12">
                                        <DefaultButton
                                            className={styles.refinerBtn}
                                            data-automation-id='test'
                                            text={item.RefinementName}
                                            value='asdf'
                                            onClick={ ()=>this._searchBtnClicked (item.RefinementName)}
                                            />           
                                    </div>
                                </div>
                                )
                            )}
                        </div>
                    );
                    
                }
                private _removeFilter():void{
                    this.props.callbackClearRefinementFilters(); 
                }
                private _searchBtnClicked(refinermentName?:string):void{
                    // var str:IRefinementFilter[]=this.state.;
                    // str.push(refinermentName);
                    
                    // //this.setState({refinementFilters:'asdf'})
                    // this.props.callbackSetRefinementFilters(this.state.refinementFilters); 
                    if (refinermentName==null) {
                        this.props.callbackClearRefinementFilters();
                    } else {
                        this.props.callbackSetRefinementFilters(refinermentName);     
                    }
                    
                }

    
    }
