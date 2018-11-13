import * as React from "react";
import * as ReactDom from 'react-dom';
import styles from './Groupbar.module.scss'
import { PrimaryButton, DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import {IRefinementFilter} from '../../ISearchResults'
import { SPComponentLoader } from '@microsoft/sp-loader';
import { IGroupbarProps } from "./IGroupbarProps";
import { IGroupbarState } from "./IGroupbarState";
import GroupItems from "../GroupItems/GroupItems";

export default class Groupbar extends React.Component<IGroupbarProps, IGroupbarState> {
    
    
    public constructor(props:IGroupbarProps, state:IGroupbarState){  
        super(props);  
        this.state = {
                    showItems:false
                    };  
    }
    public _onGroupbarClick(ref:string):void{
        
    }            
    public render(): React.ReactElement<IGroupbarProps> {  
        return(
            <div className="ms-Grid">
            {
                this.props.searchResults.RefinementResults.length > 0?
                    this.props.searchResults.RefinementResults[0].Values.map((refinerValues)=>{
                        return(
                            <div    className={styles.groupbarPanel} 
                                    onClick={ ()=>this._onGroupbarClick(refinerValues.RefinementValue)}>
                                        {refinerValues.RefinementValue}
                                        
                                        {/* <GroupItems showItems={this.state.showItems} groupTitle={refinerValues.RefinementValue} searchResults={this.props.searchResults}></GroupItems> */}

                                        
                            </div>
                            )
                    }):
                null
            }
            </div>
        );
    }

    
}
