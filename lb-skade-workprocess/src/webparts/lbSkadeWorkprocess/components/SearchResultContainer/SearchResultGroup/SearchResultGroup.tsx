import * as React from "react";
import { Link } from 'office-ui-fabric-react/lib/Link';
import { ISearchResultGroupProps } from "./ISearchResultGroupProps";
import styles from "./SearchResultGroup.module.scss";

export default class SearchResultGroup extends React.Component<ISearchResultGroupProps, {}> {
    
    public constructor(props:ISearchResultGroupProps){  
            super(props);  
            
    }

    public render(): React.ReactElement<ISearchResultGroupProps> {  
        const group = this.props.manuals;      
        return( <div>
                    <div >
                        {(() => {
                            if(group.length>1){
                                group.sort((a,b)=>a.Title.localeCompare(b.Title))
                            }        
                        })()}

                        <div className={styles.GroupBar}>
                            {this.props.groupName}
                        </div>
                        {
                            group.map((item)=>{
                                console.log(item.Title)
                                return(
                                    <div className={styles.ManualRow}>
                                        <Link href={item.LinkingUrl}>{item.Title}</Link>
                                        <div>{item.Process}</div>    
                                    </div>
                                )
                            })
                        }

                        
                    </div>
                </div>)
    }}
      
    
