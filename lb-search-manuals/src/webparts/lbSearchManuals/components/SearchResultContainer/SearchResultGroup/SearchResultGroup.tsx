import * as React from "react";
import * as ReactDom from 'react-dom';
  import { Link } from 'office-ui-fabric-react/lib/Link';
  import { BaseComponent } from 'office-ui-fabric-react/lib/Utilities';
import { PrimaryButton, DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

  import { DetailsList, buildColumns, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
  import { DirectionalHint } from 'office-ui-fabric-react/lib/common/DirectionalHint';
  import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { ISearchResultGroupProps } from "./ISearchResultGroupProps";
import { ISearchResultGroupState } from "./ISearchResultGroupState";
import styles from "./SearchResultGroup.module.scss";
import {TeachingBubbleBasicExample} from '../../TeachingBubbleBasicExample/TeachingBubbleBasicExample'
import {ITeachingBubbleBasicExampleState}from '../../TeachingBubbleBasicExample/TeachingBubbleBasicExample'
import pnp, { ConsoleListener, Logger, LogLevel, SearchQuery, SearchQueryBuilder, SearchResults, setup, Web, Sort, SortDirection } from "sp-pnp-js";
import Verdicts from '../../VerdictsContainer/VerdictsContainer'

export default class SearchResultGroup extends React.Component<ISearchResultGroupProps, ISearchResultGroupState> {
    
    public constructor(props:ISearchResultGroupProps, state:ISearchResultGroupState){  
            super(props);  
        this.state={show:true}
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
                
                
                {/* {  group.sort((a,b)=>a.Title.localeCompare(b.Title)) }                  */}
            
            
                
                
            {
            
        
            Object.keys(group).map((manual)=>{
                var showTeaserRow=false;
                var showAdditionalInfoRow=false;
                var showVerdicts=false;

                if(group[manual].LBTeaser!=null){
                    if(group[manual].LBTeaser.length>0){
                        showTeaserRow=true;
                    }    
                }

                if(group[manual].LBInfo!=null){
                    if(group[manual].LBInfo.length>0){
                        showAdditionalInfoRow=true;
                    }    
                }

                if(group[manual].LBVerdicts!=null){
                    if(group[manual].LBVerdicts.length>0){
                        showAdditionalInfoRow=true;
                    }    
                }
                
                if(group[manual].Verdicts.length>0){
                    showAdditionalInfoRow=true;
                    showVerdicts=true;
                }
                
                
                return <div className={styles.ManualRow}>
                            {
                                //if
                                this.props.displayCompactMode==true?
                                <Link href={group[manual].Path}>{group[manual].Title}</Link>:
                                //else
                                <div>
                                        <div >
                                            {/* <h4></h4> */}
                                            <Link href={group[manual].Path}>{group[manual].Title}</Link>
                                            {/* <TeachingBubbleBasicExample targetUrl={group[manual].OriginalPath}
                                                                                // text={group[manual].LBVerdicts} 
                                                                                showButtonLabel="Vis kendelser" 
                                                                                hideButtonLabel="Skjul"  
                                                                                headLine="Kendelser"
                                                                                iconName="DecisionSolid"
                                                                                /> */}
                                        </div>
                                        
                                
                                    {showTeaserRow==true?<div>{group[manual].LBTeaser} </div>:null}
                                
                                    {showAdditionalInfoRow==true?
                                    <div className="ms-Grid-row">
                                        
                                        <br/>
                                        {
                                            group[manual].LBInfo!=null?
                                                group[manual].LBInfo.length>0?
                                                    <TeachingBubbleBasicExample targetUrl={group[manual].OriginalPath}  
                                                                                text={group[manual].LBInfo} 
                                                                                showButtonLabel="Info" 
                                                                                hideButtonLabel="Skjul"   
                                                                                headLine="Info"
                                                                                iconName="Info"    />:null
                                                    :null           
                                        }

                                        {/* {    
                                            group[manual].LBVerdicts!=null?
                                                group[manual].LBVerdicts.length>0?
                                                    <TeachingBubbleBasicExample targetUrl={group[manual].OriginalPath}
                                                                                text={group[manual].LBVerdicts} 
                                                                                showButtonLabel="Vis kendelser" 
                                                                                hideButtonLabel="Skjul"  
                                                                                headLine="Kendelser"
                                                                                iconName="Articles"
                                                                                />:null
                                                    :null           
                                        } */}

                                        {/* {    
                                            <Verdicts verdictsCollection={group[manual].Verdicts} />
                                        } */}

                                    </div>  
                                    :null
                            }
                        </div>
                    }
                </div>
            })
            }  
            </div>
            </div>)
    }}
      
    
