import * as React from 'react';
import styles from './TickerItem.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';
import { PrimaryButton, MessageBarButton } from 'office-ui-fabric-react/lib/Button';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import InfoPanel from '../InfoPanel/InfoPanel'
import { Icon,IconType } from 'office-ui-fabric-react/lib/Icon';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Layer,LayerHost  } from 'office-ui-fabric-react/lib/Layer';


export interface ITickerItemProps {
  title: string;
  description: string;
  severity: string;
  showInfoPanel: boolean;
}

export interface ITickerItemState {
  showInfoPanel: boolean;
  // messageBarSeverityLevel:number;
}

export default class TickerItem extends React.Component<ITickerItemProps, ITickerItemState> {
 
  public constructor(props:ITickerItemProps,state:ITickerItemState){  
        
        super(props);  
    
        this.state = {
          // showInfoPanel:false,
          // messageBarSeverityLevel:0
          showInfoPanel:false
        };

        this.changeButtonState = this.changeButtonState.bind(this);
        
  }
  private _newGuid():any {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}
  public render(): React.ReactElement<ITickerItemProps> {
    let nmbMessageBarType = this.props.severity=='Høj' ? 1 : this.props.severity=='Middel' ? 5 : 0;
    const g = this._newGuid();
    const content = (
      <div >
        {this.props.title}
        <i className="ms-Icon ms-Icon--Info" aria-hidden="true"></i>
      </div>
    );
    nmbMessageBarType=5;
    return (
      <div className={styles.MyMessageBar} onClick={this._showInfoPanel.bind(this)}>
        
          {/* <MessageBar messageBarType={nmbMessageBarType}
                      isMultiline={ false}
                      >
            {this.props.title} 
          </MessageBar> */}
          {/* <LayerHost id={g}  /> */}
          {/* <Layer hostId='myHost'>
            {content} 
          </Layer>  */}
          <div>
            {content} 
          </div> 
          
          <InfoPanel  title={this.props.title} 
                      description={this.props.description} 
                      severity={this.props.severity} 
                      showPanel={this.state.showInfoPanel}
                      toggle={this.changeButtonState}
                      /> 
        
      </div>
    );
  }
  public changeButtonState(event) {
    this.setState({showInfoPanel:false});
}
  private _showInfoPanel(): void {
    
    if(this.state.showInfoPanel==true)
    {
      this.setState({showInfoPanel:false});
    }
    else{
      this.setState({showInfoPanel:true});
    }
    
  }
}
