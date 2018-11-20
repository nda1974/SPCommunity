import * as React from "react";
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel'
import { Link } from 'office-ui-fabric-react/lib/Link';
import { ISearchResultGroupProps } from "./ISearchResultGroupProps";
import styles from "./SearchResultGroup.module.scss";
import globalStyles from '../../App/App.module.scss'
import { ISearchResultGroupState } from "./ISearchResultGroupState";
export default class SearchResultGroup extends React.Component<ISearchResultGroupProps, ISearchResultGroupState> {
    
    public constructor(props:ISearchResultGroupProps,state:ISearchResultGroupState){  
            super(props);  
        this.state={
            showGroupItems:false
        }
            
    }

    public render(): React.ReactElement<ISearchResultGroupProps> {  
        const group = this.props.manuals;      
        return( <div>
                    
                        {(() => {
                            if(group.length>1){
                                group.sort((a,b)=>a.Title.localeCompare(b.Title))
                            }        
                        })()}
            {/* <div onClick = {this.updateState} className= {styles.GroupBar}>{this.props.groupName.length>0?this.props.groupName:'Uden kategori'}<i className={this.state.show==true? "ms-Icon ms-Icon--ChevronUp":"ms-Icon ms-Icon--ChevronDown"} aria-hidden="true"></i></div> */}
                        <div className={styles.GroupBar} onClick={()=>this.setState({showGroupItems:!this.state.showGroupItems})}> <i className={this.state.showGroupItems? "ms-Icon ms-Icon--ChevronUp":"ms-Icon ms-Icon--ChevronDown"} aria-hidden="true"></i>
                            {this.props.groupName}
                        </div>
                        <div className={this.state.showGroupItems?styles.GroupItemsContainerShow:styles.GroupItemsContainerHide}>
                        {
                            group.map((item)=>{
                                // console.log(item.Title)
                                let previewUrl = "https://lbforsikring.sharepoint.com/sites/skade/_layouts/15/getpreview.ashx?resolution=0&clientMode=modernWebPart&path=" +
                                item.OriginalPath +"&width=252&height=200";
                                // item.LinkingUrl +"&width=252&height=200";

                                return(
                                    <div className={styles.ManualRow}>
                                        
                                        {/* <img src={previewUrl} /> */}
                                        
                                        <Link href={item.OriginalPath} target="_new">
                                        
                                        {item.Title}</Link>
                                        
                                    </div>
                                )
                            })
                        }
                        </div>
                        
                    </div>
                )
    }}
      
    
