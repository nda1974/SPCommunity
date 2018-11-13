import * as React from "react";
import * as ReactDom from 'react-dom';
import styles from './Groupbars.module.scss'
import { PrimaryButton, DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import {IRefinementFilter} from '../../ISearchResults'
import { SPComponentLoader } from '@microsoft/sp-loader';
import GroupItems from "../GroupItems/GroupItems";
import { IGroupbarsProps } from "./IGroupbarsProps";
import { IGroupbarsState } from "./IGroupbarsState";
import Groupbar from "../Groupbar/Groupbar";

export default class Groupbars extends React.Component<IGroupbarsProps, IGroupbarsState> {
    
    
    public constructor(props:IGroupbarsProps, state:IGroupbarsState){  
        super(props);  
        this.state = {
                    showItems:false
                    };  
    }
    public _onGroupbarClick(ref:string):void{
        this.setState({showItems:!this.state.showItems})
    }            
    public render(): React.ReactElement<IGroupbarsProps> {  
        return(
            <div className={styles.groupbarPanel}>
            <div className={styles.groupbarTitle} onClick={()=>this.setState({showItems:!this.state.showItems})} >{this.props.title}</div>
                <div className={this.state.showItems?styles.showGroupbarItems:styles.hideGroupbarItems}>
                    <GroupItems  searchResults={this.props.searchResults} showItems={false} groupTitle={this.props.title}/>
                </div> 
            </div>
            
        );
    }

    
}
