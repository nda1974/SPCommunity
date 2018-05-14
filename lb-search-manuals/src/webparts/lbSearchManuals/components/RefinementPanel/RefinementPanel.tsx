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
                        <div className="ms-Grid-row">           
                            <div  className="ms-Grid-col ms-sm12 ms-md12 ms-lg12">
                                    <DefaultButton
                                                className={styles.refinerBtn}
                                                data-automation-id='test'
                                                text='Ryd filter'
                                                value='asdf'
                                                onClick={ ()=>this._searchBtnClicked (null)}
                                                />           
                                </div>
                            </div>
                            
                        

                        {this.props.refiners.map((item,key)=>(  
                            // item.Values.map((i,k)=>(   
                                item.Values.sort((a,b)=>a.RefinementName.localeCompare(b.RefinementName)).map((i,k)=>(
                                                                        <div className="ms-Grid-row">           
                                                                            <div  className="ms-Grid-col ms-sm12 ms-md12 ms-lg12">
                                                                                <DefaultButton
                                                                                            className={styles.refinerBtn}
                                                                                            data-automation-id='test'
                                                                                            text={i.RefinementName}
                                                                                            value='asdf'
                                                                                            onClick={ ()=>this._searchBtnClicked (i.RefinementName)}
                                                                                            />           
                                                                            </div>
                                                                        </div>
                                                                        
                                                                    
                                                                    )
                                                                )
                                                            )
                        
                                                        )
                                                        
                        }


                            

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
