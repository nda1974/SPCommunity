import * as React from "react";
import * as ReactDom from 'react-dom';
import styles from './RefinementPanel.module.scss'
import { PrimaryButton, DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';

import { SPComponentLoader } from '@microsoft/sp-loader';
import { IRefinementFilter, ISearchResult, IRefinementResult } from "../../ISearchResults";

// ########## Interfaces ########## 
export interface IRefinementPanelState{  
    // "refinementFilters":IRefinementFilter[];
}

export interface IRefinementPanelProps {
    callbackSetRefinementFilters:any;
    callbackClearRefinementFilters:any;
    refiners:IRefinementResult[];
    myRefiners?:IRefinementResult;
    selectedRefiners:string[];
}

export interface myRefiners{
    filterName:string;
    values:any[];
}
// ########## Class ########## 
export default class RefinementPanel extends React.Component<IRefinementPanelProps, IRefinementPanelState> {
    // ########## Constructor ########## 
    public constructor(props:IRefinementPanelProps, state:IRefinementPanelState){  
        super(props);  
        this.state = {
                    refinementFilters:[]
                    };  
        this.callbackSetRefinementFilters= this.callbackSetRefinementFilters.bind(this)
    }
    
    public render(): React.ReactElement<IRefinementPanelProps> {  
        return(
            <div className="ms-Grid">
            <div className="ms-Grid-row">           
            
                <div  className="ms-Grid-col ms-sm12 ms-md12 ms-lg12">
                    <DefaultButton
                        className={styles.refinerBtn} 
                        data-automation-id='test'
                        text="Ryd filter"
                        value=""
                        onClick={ ()=>this._searchBtnClicked (null,null,null)}
                        
                        />           
                </div>
                {this.props.myRefiners.Values.map((item,key)=>(  
                    
                    
                        <div  className="ms-Grid-col ms-sm12 ms-md12 ms-lg12">
                            <DefaultButton
                                className={styles.refinerBtn} 
                                data-automation-id='test'
                                text={item.RefinementName}
                                value={item.RefinementToken}
                                // onClick={ ()=>this._searchBtnClicked (item.RefinementName,this.props.selectedRefiners.indexOf(item.RefinementName)>-1?true:false)}
                                onClick={ ()=>this._searchBtnClicked (item.RefinementToken,item.RefinementName,this.props.selectedRefiners.indexOf(item.RefinementName)>-1?true:false)}
                                
                                />           
                        </div>
                    
                    )
                )}
                </div>
            </div>
        );
        
    }
            
    private callbackSetRefinementFilters(newState):void {
        this.setState({ refinementFilters: newState })
    }
    
    private _removeFilter():void{
        this.props.callbackClearRefinementFilters(); 
    }
    private _searchBtnClicked(refinermentToken?:string,refinermentName?:string, toggle?:boolean):void{
        if (refinermentName==null) {
            this.props.callbackClearRefinementFilters();
        } else {
            var s =refinermentToken.replace(/\"/g, '');
            // this.props.callbackSetRefinementFilters(refinermentName,toggle);     
            this.props.callbackSetRefinementFilters(s,refinermentName,toggle);
        }
    }

    
    }
