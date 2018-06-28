import * as React from "react";
import { Link } from 'office-ui-fabric-react/lib/Link';
import { ISearchResultGroupProps } from "./ISearchResultGroupProps";
import styles from "./SearchResultGroup.module.scss";
import globalStyles from '../../App/App.module.scss'
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
                                        {/* <div className="ms-Grid-row"> */}
                                        <div className={styles.processTagRow}>
                                        {
                                            
                                            item.Process.split(';').map((p)=>{
                                                return <div className="ms-Grid-col ms-md2 ms-lg2"><div className={styles.processTag}>{p}</div></div>    
                                            })
                                        }
                                        </div>
                                        {/* <div>{item.Process}</div>     */}
                                    </div>
                                )
                            })
                        }

                        
                    </div>
                </div>)
    }}
      
    
