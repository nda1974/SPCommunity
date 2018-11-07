//import pnp ,{setup}from "sp-pnp-js";
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { sp, RenderListDataParameters, RenderListDataOptions, Web } from "@pnp/sp";
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import * as React from 'react';
import styles from './App.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';
import { IAppProps } from './IAppProps';
import { IAppState } from "./IAppState";

export default class App extends React.Component<IAppProps, IAppState> {
  public constructor(props:IAppProps,state:IAppState){  
    super(props);
  
    this.state= {
                  showPanel:false,
                  panelHeader:'',
                  panelText:'',
                  listItems:[]
                                  }
                  sp.setup({
                    spfxContext:this.context,
                    
                  })
                  
              
              
              this.fetchSharePointData();
              
    
}



private fetchSharePointData(){
  let web = new Web("https://lbforsikring.sharepoint.com/sites/SR/");
  
  web.lists.getByTitle("Medlemsgrupper").renderListDataAsStream({
    RenderOptions: RenderListDataOptions.ListData,
    ViewXml :   `<View>
    <ViewFields>
                      <FieldRef Name="Title"/>
                      <FieldRef Name="Beskrivelse"/>
                      <FieldRef Name="Medlemsgruppe"/>
                  </ViewFields>
    <RowLimit Paged="TRUE">100</RowLimit>
  </View>`
  }).then((items:any)=>{

    this.setState({listItems:items.Row})
    console.log(items)
  })
    // return sp.web.lists.getByTitle("Medlemsgrupper").items.get().then(
    //           (data:any[])=>{
    //             console.log(data)
    //             this.setState({listItems:data})
    //           }
    //         );
}
//https://prismic.io/docs/reactjs/rendering/rich-text
  public render(): React.ReactElement<IAppProps> {
    
    return (
      
      <div className={ styles.container }>
        <div className={ styles.row }>
          
          <div className={ styles.column }>
              {
                this.props.filterTerm!=undefined && this.props.filterTerm.length>0 ?
                  this.state.listItems.map((rowItem)=>{
                    
                      if(rowItem.Medlemsgruppe.Label == this.props.filterTerm[0].name){
                        return(
                          <div>
                            <div  className={styles.memberGroupRow} 
                                  // onMouseOut={()=>this.setState({showPanel:!this.state.showPanel})} 
                                  // onMouseOver={()=>this.setState({panelText:rowItem.Beskrivelse,showPanel:!this.state.showPanel,panelHeader:rowItem.Title})} 
                                  onClick={()=>this.setState({panelText:rowItem.Beskrivelse,showPanel:true,panelHeader:rowItem.Title})}>
                                    {rowItem.Title}
                            </div>
                            
                          </div>
                          )
                      }})
                : null
              }
            </div>
          
          <div className={ styles.column }>
              <div className={this.state.showPanel ? styles.showDiv : styles.hideDiv}>
              <div className={ styles.panelRow }>
                
                <div className={ styles.columnTen }>
                  <div className={styles.ccPanelHeader} >
                    {this.state.panelHeader}
                  </div>
                </div>

                <div className={ styles.columnTwo } onClick={()=>this.setState({showPanel:false})}>
                  <Icon iconName="Cancel" className={styles.myIconExample} />
                </div>

  


              </div>

              
              
              <div className={styles.panelContent} dangerouslySetInnerHTML={{ __html: this.state.panelText }} />
              </div>          
          </div>
        
        </div>
      </div>
           
      
      
    );
  }
}
