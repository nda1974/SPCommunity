import * as React from 'react';
import styles from './Process.module.scss';
import { IProcessProps } from './IProcessProps';
import { Icon } from 'office-ui-fabric-react/lib/components/Icon';
import { ActionButton,IconButton, IIconProps, IContextualMenuProps, Stack } from 'office-ui-fabric-react';

const searchIcon: IIconProps = { iconName: 'Search' };
export class Process extends React.Component<IProcessProps, {}> {

    public constructor(props:IProcessProps,{}){  
        super(props);
        
    this._onclickCallBack = this._onclickCallBack.bind(this);
    }
  private _onclickCallBack():void{
      this.props.hoverCallBack(this.props.id);
  }  
  
  public render(): React.ReactElement<IProcessProps> {
    const tileStyle: React.CSSProperties = {};
    const nameCSSClass = this.props.name.charAt(0);

    return (
        // <div className={styles.item }  onClick={this._onclickCallBack}>

        <div
            onClick={this._onclickCallBack}
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
                :null}  >
        {this.props.name}
        
        {/* <IconButton 
            iconProps={searchIcon} 
            title="Søg" 
            ariaLabel="Søg"
            className={styles.iconBtn}
            href={"https://lbforsikring.sharepoint.com/sites/NICD/_layouts/15/search.aspx/siteall?q=" + this.props.name} >
                
         </IconButton> */}
        </div>
    );
  }
}