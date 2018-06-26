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

export default class SearchResultContainer extends React.Component<ISearchResultContainerProps, ISearchResultContainerState>{
    private queryText:string;
    public constructor(props:ISearchResultContainerProps,state:ISearchResultContainerState){  
            super(props);  
    }

    public render(): React.ReactElement<ISearchResultContainerProps> {  
        return(
            <div className="ms-Grid-row">
            {
                this.props.results.map((item)=>{
                    return(
                        
                        <div>
                            <Link href={item.DocumentLink}>{item.Title}</Link>
                        </div>
                        
                    )
                })
            }
            </div>
            
        );
    }
    
    
    
}


