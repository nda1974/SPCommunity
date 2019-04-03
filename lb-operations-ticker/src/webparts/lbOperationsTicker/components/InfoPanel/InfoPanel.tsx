import * as React from "react";
import * as ReactDOM from "react-dom";
import { DefaultButton, PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { Panel, PanelType } from "office-ui-fabric-react/lib/Panel";
import styles from './InfoPanel.module.scss';




export interface IInfoPanelProps {
    // 
    title:string;
    description:string;
    severity:number;
    showPanel:boolean;
    toggle:any;
}

export interface IInfoPanelState {
    showPanel:boolean;
    showDialog:boolean;
    dialogTitle:string;
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

        
    }
    private createMarkup() {
        var r=this.props.description;
        return {__html:r };
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
                            <hr/>
                            
                            <div dangerouslySetInnerHTML={{ __html: this.props.description }} />
                            {/* <div >{this.props.description}</div> */}
                        </div>
                </Panel>
            </div>
        );
    }
}