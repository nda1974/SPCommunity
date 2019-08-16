import * as React from 'react';

import { IDefaultProps } from '../../Generics/IDefaultProps';

import { escape } from '@microsoft/sp-lodash-subset';
import SPService from "../../../services/SPService"
export default class DefaultTemplate extends React.Component<IDefaultProps,{}> {
  public constructor(props:IDefaultProps,{}){  
    super(props);

    // this.state= {
    //                 description:'',
    //                 listItems:[]
    //             }

  //   let spService: SPService=new SPService(
  //       {
  //           description:'',
  //           targetListID:this.props.targetListId,
  //           targetSiteUrl:this.props.targetSiteUrl
  //       }
  //   );
    
  //  const res = spService.getListItemsByListID().then(x=>{
  //   this.setState({listItems:x})
  //  })

   
}
  public render(): React.ReactElement<IDefaultProps> {
    return (
      <div>
        {this.props.description}
        {
          this.props.listItems.map(items=>{
            return(
              <div>{items.Title}</div>
            )
          })
        }
      </div>
    );
  }
}
