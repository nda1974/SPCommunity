import * as React from 'react';
import styles from './MenuContainer.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';
import { IMenuContainerProps } from './MenuContainerProps';
import { IMenuContainerState } from '../../../../../lib/webparts/lbServiceUgensmenu/components/MenuContainer/MenuContainerState';
import MenuItem from '../MenuItem/MenuItem'
export default class LbServiceUgensmenu extends React.Component<IMenuContainerProps, IMenuContainerState> {

  public constructor(props:IMenuContainerProps,state:IMenuContainerProps){  
    super(props);
    

    this.state= {
                  listItems:[],
                  selectedDaysMenu:'',
                  selectedDay:''
                  
                }
    this._changeMenu=this._changeMenu.bind(this);
    
    // while(this.props.listItems.length==0){

    // }
    // let f = this.props.listItems;
  }
  public render(): React.ReactElement<IMenuContainerProps> {
    return (
      <div className={`ms-Grid  ${styles.container}`}>
         <div className="ms-Grid-row"> 
          <div className={`ms-Grid-col ms-sm2 ms-md2 ms-lg1`} />
          {
            
              this.props.listItems.map((item)=>{
              // var menus=[];
              // menus.push(item.Title);
              var today = new Date();
              var d = new Date(item.Dato);
              var s = d.getDay();
              var weekDays=['Mandag','Tirsdag','Onsdag','Torsdag','Fredag']
              var day = weekDays[s-1];
              var isActive=false;
              if(today.getDay()==s)
              {
                isActive=true;
              }
                return(
                      <div className={`ms-Grid-col ms-sm2 ms-md2 ms-lg2 ${styles.title}`}> 
                        <MenuItem changeMenu={this._changeMenu} day={day} menu={item.Title} isActive={isActive} />          
                      </div>
                )
            })
          }
          <div className={`ms-Grid-col ms-sm2 ms-md2 ms-lg1`} />
        </div>
        <div className={`ms-Grid-row  ${styles.menuText}`}>
          <h1>{this.state.selectedDay}</h1>
          {this.state.selectedDaysMenu}
          
        </div>
      </div>
    );
  }

  public _changeMenu(menu,day){
    this.setState({selectedDaysMenu:menu});
    this.setState({selectedDay:day});
  }
}
