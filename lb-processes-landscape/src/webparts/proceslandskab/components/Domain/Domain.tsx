import * as React from 'react';
import styles from './Domain.module.scss';
import { IDomainProps } from './IDomainProps';
import { Icon } from 'office-ui-fabric-react/lib/components/Icon';

export class Domain extends React.Component<IDomainProps, {}> {

    public constructor(props:IDomainProps,{}){  
        super(props);
        
    this._onclickCallBack = this._onclickCallBack.bind(this);
  
    }
  private _onclickCallBack():void{
      this.props.hoverCallBack(this.props.id);
  }  
  
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
            
            onClick={this._onclickCallBack}>  
                {this.props.name}
            </div>
    );
  }
}