import * as React from "react";
import * as ReactDom from 'react-dom';
import styles from './GroupItems.module.scss'
import { PrimaryButton, DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import {IRefinementFilter} from '../../ISearchResults'
import { SPComponentLoader } from '@microsoft/sp-loader';
import { IGroupItemsProps } from "./IGroupItemsProps";
import { IGroupItemsState } from "./IGroupItemsState";
import { Link } from "office-ui-fabric-react/lib/Link";

export default class GroupItems extends React.Component<IGroupItemsProps, IGroupItemsState> {

    
    
    public constructor(props:IGroupItemsProps, state:IGroupItemsState){  
        super(props);  
        this.state = {
                    showItems:false
                    };  
    }
    
    public render(): React.ReactElement<IGroupItemsProps> {  
        return(
            <div >
                                        {
                                            this.props.searchResults.RelevantResults.sort((a,b)=>a.Title.localeCompare(b.Title)).map((res)=>{
                                                let terms:string[]=res.PoliceManualSubGroup.split(';')
                                                return(
                                                terms.indexOf(this.props.groupTitle) > -1  || 
                                                res.PoliceManualSubGroup == this.props.groupTitle?
                                                <div className={styles.groupItems}>
                                                    <a target='_blank' href={res.OriginalPath}>
                                                        {res.Title}
                                                    </a>
                                                </div>: null
                                                )
                                            })
                                            
                                        }
                                        </div>
            
        );
    }

}