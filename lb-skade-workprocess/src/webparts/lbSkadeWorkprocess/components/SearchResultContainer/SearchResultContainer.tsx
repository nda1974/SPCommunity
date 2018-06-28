import * as React from "react";
import * as ReactDom from 'react-dom';
import {
HoverCard,
IExpandingCardProps
} from 'office-ui-fabric-react/lib/HoverCard';
import { BaseComponent } from 'office-ui-fabric-react/lib/Utilities';
import { PrimaryButton, DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';


import { ISearchResultContainerProps } from "./ISearchResultContainerProps";
import { ISearchResultContainerState } from "./ISearchResultContainerState";


import styles from "./SearchResultContainer.module.scss";
import { ISearchResult } from "../../ISearchResults";
import { Link } from 'office-ui-fabric-react/lib/Link';
import SearchResultGroup from "./SearchResultGroup/SearchResultGroup";

export default class SearchResultContainer extends React.Component<ISearchResultContainerProps, ISearchResultContainerState>{
    private queryText:string;
    public constructor(props:ISearchResultContainerProps,state:ISearchResultContainerState){  
            super(props);  
    }

    public render(): React.ReactElement<ISearchResultContainerProps> {  
        
        let groups:ISearchResult[]=[];
        var groupBy = require('lodash.groupby');



        var groupedManuals:any=groupBy(this.props.results,'Målgruppe')
        var arrGroupKeys:string[]=[];
        {
            Object.keys(groupedManuals).map((groupKey,i)=>{
                arrGroupKeys.push(groupKey);
        })}

        arrGroupKeys.sort();



        
        return(
            <div >
            {
                    arrGroupKeys.map((groupKey)=>{
                        const group = groupedManuals[groupKey];
                        
                        return ( <div >
                                    <SearchResultGroup groupName={groupKey} manuals={group}  ></SearchResultGroup>    
                                </div>
                        )
                        })
            }
            </div>
            
        );
    }
    
    
    
    
}


