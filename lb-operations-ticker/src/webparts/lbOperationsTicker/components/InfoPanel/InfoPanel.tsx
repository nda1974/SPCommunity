import * as React from "react";
import * as ReactDOM from "react-dom";
import { DefaultButton, PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { Panel, PanelType } from "office-ui-fabric-react/lib/Panel";
import styles from './InfoPanel.module.scss';
import pnp ,{setup}from "sp-pnp-js";




export interface IInfoPanelProps {
    // 
    title:string;
    description:string;
    severity:number;
    showPanel:boolean;
    toggle:any;
    created:string;
    createdBy:number;
}

export interface IInfoPanelState {
    showPanel:boolean;
    showDialog:boolean;
    dialogTitle:string;
    author?:string;
}


export default class InfoPanel extends React.Component<IInfoPanelProps, IInfoPanelState> {
    private _self = this;
    constructor(props: IInfoPanelProps) {
        super(props);
        this.state = {
            showPanel: false,
            showDialog: false,
            dialogTitle: ""
        };
        
        // props.showPanel=false;
        // this.props.showPanel=false;
        // this.test= this.test.bind(this);
        this.GetAuthorName();
    }
    public GetAuthorName(){
        pnp.sp.web.siteUsers.getById(this.props.createdBy).get().then((result)=> {
            this.setState({author:result.Title})
        });

    }
    // private createMarkup() {
    //     var r=this.props.description;
    //     return {__html:r };
    //   }
      
      private async GetUserName(id):Promise<any>{
  
        return await pnp.sp.web.siteUsers.getById(id).get().then(function(result) {
          return result.Title;
        });
      }
    public setVisibility():void{}
    public render(): React.ReactElement<IInfoPanelProps> {
        return (
            <div className="ms-Grid" >
                <Panel 
                    onDismiss={this.props.toggle}
                    isOpen={this.props.showPanel}
                    type={PanelType.medium}
                    headerText=''
                    isLightDismiss={ true } >
                        <div >
                            <div className={styles.Title}>{this.props.title}</div>
                            
                            <div className={styles.Content} dangerouslySetInnerHTML={{ __html: this.props.description }} >
                            
                            </div>
                            {/* <div >{this.props.description}</div> */}
                            <div className={styles.ByLine}>
                            <hr/>
                            {/* {this.GetUserName(this.props.createdBy)} */}
                            
                            <div>Oprettet af: {this.state.author}</div>
                            <div>Dato: {new Date( this.props.created).toLocaleDateString() + ' - kl. ' + new Date( this.props.created).toLocaleTimeString()}</div>
                            
                            
                            </div>
                            
                        </div>
                </Panel>
            </div>
        );
    }
}