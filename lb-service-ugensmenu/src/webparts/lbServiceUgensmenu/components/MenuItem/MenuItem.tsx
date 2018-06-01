import * as React from 'react';
import { escape } from '@microsoft/sp-lodash-subset';
import { IMenuItemProps } from './MenuItemProps';
import styles from './MenuItem.module.scss' 
export default class MenuItem extends React.Component<IMenuItemProps, {}> {
  public constructor(props:IMenuItemProps,{}){  
    super(props);
  

    this._changeMenu=this._changeMenu.bind(this);
    
    if(this.props.isActive==true){
      this._changeMenu();
    }
}
public render(): React.ReactElement<IMenuItemProps> {
    return (
      <div onClick={this._changeMenu} className={`${styles.container}`} >
          {this.props.day}
      </div>
    );
  }
  public _changeMenu(){
    this.props.changeMenu(this.props.menu,this.props.day);
  }
}
