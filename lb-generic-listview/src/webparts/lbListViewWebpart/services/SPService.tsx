import { sp, RenderListDataParameters, RenderListDataOptions, Web } from "@pnp/sp";
import * as React from 'react';
import { ISPServiceProps } from './ISPServiceProps'
import { IWebPartContext } from "@microsoft/sp-webpart-base";
export default class SPService extends React.Component<ISPServiceProps> {
  public constructor(props:ISPServiceProps){  
    super(props);
  
    // sp.setup({
    // spfxContext:this.context
    // })
}



public async getListItemsAsStream():Promise<any>{
  
    let web = new Web(this.props.targetSiteUrl);
    const result=await web.lists.getById(this.props.targetListID).renderListDataAsStream({
    RenderOptions: RenderListDataOptions.ListData
  }).then(res=>{
    return res;
  })
  return result.Row;
}


public async getListItemsByListID():Promise<any>{
    let web = new Web(this.props.targetSiteUrl);
      const res = await web.lists.getById(this.props.targetListID).items.get();
      return res;
  }

//https://prismic.io/docs/reactjs/rendering/rich-text
  
}
