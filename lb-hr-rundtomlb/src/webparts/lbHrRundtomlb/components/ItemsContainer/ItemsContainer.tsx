import pnp ,{setup}from "sp-pnp-js";
import * as React from 'react';
import { escape } from '@microsoft/sp-lodash-subset';
import { IItemsContainerProps } from "./ItemsContainerProps";
import Items from '../Items/Items'
export default class ItemsContainer extends React.Component<IItemsContainerProps, {}> {
  
public checkDates(theStartDate, theEndDate) {
    var dateNow = new Date();
    var dateStart = new Date(theStartDate);
    var dateEnd = new Date(theEndDate);
  //alert(dateStart + "\n" + dateNow + "\n" + dateEnd);
    if ((dateStart < dateNow) && (dateNow < dateEnd)) {
    //alert("Between start and end: " + theDesc);
    return true;
  } else {
    //alert("NOT between start and end: " + theDesc);
    return false;
    }
}  

  public render(): React.ReactElement<IItemsContainerProps> {
    return (
      <div >
        {this.props.listItems.map((item)=>{
          let s = 'https://lbforsikring.sharepoint.com/sites/HR/rundtomlbbilleder/' + item.FileLeafRef;
          let name = item.FileLeafRef.split('.')[0]
          var d = new Date(item.EventDate)
          
          let eventDate=d.toLocaleDateString();
          return(<div>
                  <Items name={name} department={item.Afdeling} event={item.Begivenhed} imageUrl={s} eventDate={new Intl.DateTimeFormat('da-DK', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: '2-digit' 
                  }).format(d)} />
                  
                </div>
                )

                        
        })}
      
        

        
      </div>
    );
  }
}
