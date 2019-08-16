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
  
  // let web = new Web("https://lbforsikring.sharepoint.com/sites/SR/");
    // const result=await web.lists.getByTitle("Medlemsgrupper").renderListDataAsStream({
    let web = new Web(this.props.targetSiteUrl);
    const result=await web.lists.getById(this.props.targetListID).renderListDataAsStream({
    RenderOptions: RenderListDataOptions.ListData
  }).then(res=>{
    return res;
  })
  return result.Row;
}
public async fetchSharePointDataORG():Promise<any>{
  
  // let web = new Web("https://lbforsikring.sharepoint.com/sites/SR/");
    // const result=await web.lists.getByTitle("Medlemsgrupper").renderListDataAsStream({
    let web = new Web(this.props.targetSiteUrl);
    const result=await web.lists.getById(this.props.targetListID).renderListDataAsStream({
    RenderOptions: RenderListDataOptions.ListData,
    ViewXml :   `<View>
    <ViewFields>
                      <FieldRef Name="Title"/>
                      <FieldRef Name="Beskrivelse"/>
                      <FieldRef Name="Medlemsgruppe"/>
                  </ViewFields>
    <RowLimit Paged="TRUE">100</RowLimit>
  </View>`
  }).then(res=>{
    return res;
  })
  return result.Row;
}

public async getListItemsByListID():Promise<any>{
    let web = new Web(this.props.targetSiteUrl);
      // const res = await web.lists.getById(this.props.targetListID).items.get();

      const res = await web.lists.getByTitle("Medlemsgrupper").renderListDataAsStream({
      RenderOptions: RenderListDataOptions.ListData,
      ViewXml :   `<View>
      <ViewFields>
                        <FieldRef Name="Title"/>
                        <FieldRef Name="Beskrivelse"/>
                        <FieldRef Name="Medlemsgruppe"/>
                    </ViewFields>
      <RowLimit Paged="TRUE">100</RowLimit>
    </View>`
    })
  
    return res;
      // return sp.web.lists.getByTitle("Medlemsgrupper").items.get().then(
      //           (data:any[])=>{
      //             console.log(data)
      //             this.setState({listItems:data})
      //           }
      //         );
  }

//https://prismic.io/docs/reactjs/rendering/rich-text
  
}
