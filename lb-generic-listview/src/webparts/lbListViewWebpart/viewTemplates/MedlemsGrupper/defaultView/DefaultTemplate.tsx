import * as React from 'react';

import { IDefaultProps } from '../../MedlemsGrupper/defaultView/IDefaultProps';
import { IDefaultState } from '../../MedlemsGrupper/defaultView/IDefaultState';
import { escape } from '@microsoft/sp-lodash-subset';
import styles from './DefaultTemplate.module.scss';
export default class DefaultTemplate extends React.Component<IDefaultProps, IDefaultState> {
  public constructor(props:IDefaultProps,state:IDefaultState){  
    super(props);

    this.state= {
                  panelHeader:'',
                  panelText:'',
                  showPanel:false
                }
  }
  public render(): React.ReactElement<IDefaultProps> {
    return (
      
      
        <div className={styles.container}>
          <div className={ styles.componentRow }>
            <div className={ styles.column4 }>                            
            {
              this.props.medlemsGruppe!=undefined && this.props.medlemsGruppe.length>0?
                    this.props.listItems.map(item=>{
                      if(item.Medlemsgruppe.Label == this.props.medlemsGruppe[0].name){
                        return(
                          <div  className={styles.memberGroupRow}
                                onClick={()=>this.setState({panelText:item.Beskrivelse,showPanel:true,panelHeader:item.Title})}>
                                {item.Title}
                          </div>
                        )
                      }
                    })
                    :null
            }
            </div>
            <div className={ styles.column8 }>
              <div className={this.state.showPanel ? styles.showDiv : styles.hideDiv}>
                  <div className={styles.ccPanelHeader}>{this.state.panelHeader}</div>
                  <div className={styles.panelContent} dangerouslySetInnerHTML={{ __html: this.state.panelText }} />
              </div>
            </div>
          </div>
        </div>
    )

      }
}
