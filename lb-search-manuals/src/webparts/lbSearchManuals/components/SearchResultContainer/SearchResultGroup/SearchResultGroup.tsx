import * as React from "react";
import { Link } from 'office-ui-fabric-react/lib/Link';
import { ISearchResultGroupProps } from "./ISearchResultGroupProps";
import { ISearchResultGroupState } from "./ISearchResultGroupState";
import styles from "./SearchResultGroup.module.scss";

export default class SearchResultGroup extends React.Component<ISearchResultGroupProps, ISearchResultGroupState> {
    
    public constructor(props:ISearchResultGroupProps, state:ISearchResultGroupState){  
            super(props);  
        this.state={show:false}
            this.updateState = this.updateState.bind(this);
            
    }
    updateState() {
        if  (this.state.show == true){
            this.setState({show: false})
        }
        else{
            this.setState({show: true})
        }
        
     }

    public render(): React.ReactElement<ISearchResultGroupProps> {  
        const group = this.props.manuals;      
        const showCompactMode = true;  
        const verdicts = [];
        return(<div >
            <div onClick = {this.updateState} className= {styles.GroupBar}>{this.props.groupName.length>0?this.props.groupName:'Uden kategori'}<i className={this.state.show==true? "ms-Icon ms-Icon--ChevronUp":"ms-Icon ms-Icon--ChevronDown"} aria-hidden="true"></i></div>
            
            <div className= {this.state.show==true? styles.Show:styles.Hide}>
                {(() => {
                    if(group.length>1){
                        group.sort((a,b)=>a.Title.localeCompare(b.Title))
                    }        
                })()}
            {
            
        
            Object.keys(group).map((manual)=>{
                return <div className={styles.ManualRow}>
                            <Link href={group[manual].Path}>{group[manual].Title}</Link>
                        </div>
            })
            }  
            </div>
            </div>)
    }}
      
    
