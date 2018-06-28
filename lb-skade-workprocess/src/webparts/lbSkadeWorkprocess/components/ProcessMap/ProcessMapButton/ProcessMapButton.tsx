import * as React from "react";
import * as ReactDom from 'react-dom';

import { PrimaryButton, DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import styles from './ProcessMapButton.module.scss'

// ############# PROPS #############
export interface IProcessMapButtonProps{
    setAreaFilter:any;
    areaFilter:string;
    isSelected:boolean;
    
}
// ############# STATE #############
export interface IProcessMapButtonState{
    isSelected:boolean;
}

export default class ProcessMapButton extends React.Component<IProcessMapButtonProps, IProcessMapButtonState>{
    private queryText:string;
    // ############# CONSTRUCTOR #############
    public constructor(props:IProcessMapButtonProps,state:IProcessMapButtonState){  
            super(props);  
        this.state = {
            isSelected:false
            };  
        this.setAreaFilter=this.setAreaFilter.bind(this)
        
    }

    public render(): React.ReactElement<IProcessMapButtonProps> {  
        return(
            <div>
                <DefaultButton
                    text={this.props.areaFilter}
                    onClick={ ()=>this.setAreaFilter(this.props.areaFilter)}
                    className={this.props.isSelected==true?styles.selected:styles.unselected}
                    
                />           
            </div>
        );
    }

    private setAreaFilter(areaName):void {
        if (this.state.isSelected==true) {
            // this.setState({isSelected:false})
            this.props.setAreaFilter()
        }
        else{
            // this.setState({isSelected:true})
            this.props.setAreaFilter(areaName)
        }
        
    }
    
    
    
    
}


