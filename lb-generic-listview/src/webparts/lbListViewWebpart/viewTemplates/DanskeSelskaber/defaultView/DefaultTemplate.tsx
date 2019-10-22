import * as React from 'react';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { IDefaultProps } from '../../Generics/IDefaultProps';
import { IDefaultState } from '../../DanskeSelskaber/defaultView/IDefaultState';
import styles from './DefaultTemplate.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';
import SPService from "../../../services/SPService"
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Callout, DirectionalHint } from 'office-ui-fabric-react/lib/Callout';
import { Guid } from '@microsoft/sp-core-library';
export default class DefaultTemplate extends React.Component<IDefaultProps,IDefaultState> {
  public constructor(props:IDefaultProps,state:IDefaultState){  
    super(props);
    this.state= {
      panelHeader:'',
      panelKontaktOplysninger:'',
      panelSelskabsInformation:'',
      showPanel:false
    }

   
}
private _menuButtonElement = React.createRef<HTMLDivElement>();

  public render(): React.ReactElement<IDefaultProps> {
    return (
      <div className={styles.container}>
          <div className={ styles.componentRow }>
            <div className={styles.sticky}>
              <div className={this.state.showPanel ? styles.showDiv : styles.hideDiv}>
                  <div className={styles.ccPanelHeader}>{this.state.panelHeader}
                    <IconButton disabled={false} 
                                checked={false} 
                                iconProps={{ iconName: 'ChromeClose' }} 
                                title="Luk"
                                onClick={()=>this.setState({showPanel:!this.state.showPanel})} 
                                ariaLabel="Luk" />
                  </div>
                  <div className={styles.panelContent} ><h1>Selskabsinfo</h1></div>
                  <div className={styles.panelContent} dangerouslySetInnerHTML={{ __html: this.state.panelSelskabsInformation }} />
                  <div className={styles.panelContent} ><h1>Kontaktoplysninger</h1></div>
                  <div className={styles.panelContent} dangerouslySetInnerHTML={{ __html: this.state.panelKontaktOplysninger }} />
              </div>
            </div>  
            {/* <div className={ styles.column4 }>    */}
            <div>                         
            {
              this.props.listItems.map(item=>{
                const g = Guid.newGuid().toString();
                return(
                  
                  <div  className={styles.memberGroupRow}
                                                    onClick={()=>this.setState({panelSelskabsInformation:item.Selskabsinformation,
                                                    showPanel:true,
                                                    panelKontaktOplysninger:item.Kontaktoplysninger,
                                                    panelHeader:item.Title
                                                    })} >
                        
                          {item.Title}
                  </div>
                )
              })
            }
            
            </div>
            {/* <div ref={this._menuButtonElement}></div> */}
            {/* <div className={ styles.column8 }>
              <div className={this.state.showPanel ? styles.showDiv : styles.hideDiv}>
                  <div className={styles.ccPanelHeader}>{this.state.panelHeader}</div>
                  <div className={styles.panelContent} ><h1>Selskabsinfo</h1></div>
                  <div className={styles.panelContent} dangerouslySetInnerHTML={{ __html: this.state.panelSelskabsInformation }} />
                  <div className={styles.panelContent} ><h1>Kontaktoplysninger</h1></div>
                  <div className={styles.panelContent} dangerouslySetInnerHTML={{ __html: this.state.panelKontaktOplysninger }} />
              </div>
            </div> */}
          </div>

        </div>
    );
  }
}
