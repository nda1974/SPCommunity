import * as React from 'react';
import styles from './Domain.module.scss';
import { IDomainProps } from './IDomainProps';
import { Icon } from 'office-ui-fabric-react/lib/components/Icon';
import { IDomainState } from './IDomainState';

export class Domain extends React.Component<IDomainProps, IDomainState> {

    public constructor(props:IDomainProps,state:IDomainState){  
        super(props);
        this.state={
            showProcesses:false
        }
        this._onclickCallBack = this._onclickCallBack.bind(this);
        // this._showProcesses = this._showProcesses.bind(this);
        // this._toggleProcessView = this._toggleProcessView.bind(this);
        // this._showProcessView = this._showProcessView.bind(this);
        // this._hideProcessView = this._hideProcessView.bind(this);
  
      }
  private _onclickCallBack():void{
      this.props.hoverCallBack(this.props.id);
  }  
  
// private _toggleProcessView():void{
//     const currentState = this.state.showProcesses;
//     this.setState({showProcesses:!currentState});
// }
// private _showProcessView():void{
//     this.setState({showProcesses:true});
// }
// private _hideProcessView():void{
    
//     this.setState({showProcesses:false});
// }
  
  public render(): React.ReactElement<IDomainProps> {
    const tileStyle: React.CSSProperties = {};
    const MyIcon = () => <Icon iconName="Mail" className="ms-IconExample" />;
    
    const nameCSSClass = this.props.name.charAt(0);
        
    
    return (
        <div
            className={nameCSSClass=='A'
                ?styles.item +" " +styles.item__DomainA
                    :nameCSSClass=='B'
                    ?styles.item +" " +styles.item__DomainB
                    :nameCSSClass=='C'
                    ?styles.item +" " +styles.item__DomainC
                    :nameCSSClass=='D'
                    ?styles.item +" " +styles.item__DomainD
                    :nameCSSClass=='E'
                    ?styles.item +" " +styles.item__DomainE
                :null}  
            
            onClick={this._onclickCallBack}
            onMouseOver={()=>{this.setState({showProcesses:true})}}
            onMouseOut={()=>{this.setState({showProcesses:false})}}>  
                {this.props.name}
                <div    onMouseOver={()=>{this.setState({showProcesses:true})}}
                        onMouseOut={()=>{this.setState({showProcesses:false})}}
                        className={this.state.showProcesses==true?styles.processesContainer:styles.hoverDivHide}>
                            <h3>{this.props.name}</h3>
                {
                    this.props.processes.map(proces=>{
                    return(
                        <div className={styles.processesItem}>{proces.Name}</div>
                    )})
                }
                </div>
                
                
                
            </div>
    );
  }
}