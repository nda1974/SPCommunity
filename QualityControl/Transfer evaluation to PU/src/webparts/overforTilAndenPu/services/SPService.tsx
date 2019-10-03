import { sp, RenderListDataParameters, RenderListDataOptions, Web } from "@pnp/sp";
import * as React from 'react';
import { ISPServiceProps } from './ISPServiceProps'
import { IWebPartContext } from "@microsoft/sp-webpart-base";
import { string } from "prop-types";
export default class SPService extends React.Component<ISPServiceProps> {
  public constructor(props:ISPServiceProps){  
    super(props);
    this.state={
      currentUserDepartment:''
    }
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

private findCurrentUserDepartment():string{
  this.props.currentUserEmail
  return ""
}
public async getListItemsByListID():Promise<any>{


  if(this.props.targetListID=='fc98c6c2-1d45-4502-aedd-970f39c474eb')
  {
    let web = new Web(this.props.targetSiteUrl);
    const currentDataExtractionDate = await web.lists.getById(this.props.targetListID).items.select("DataExtractionID").orderBy('DataExtractionDate',false).top(1).get().then(data=>{
        return data;
    })
    
    
    const res = await web.lists
                          .getById(this.props.targetListID)
                          .items
                          .select("ID,DataExtractionID,ClaimID,EmployeeInFocusDisplayName,ControlSubmitted,PriviligedUser/Id,PriviligedUser/EMail")
                          .expand("PriviligedUser")
                          .filter("DataExtractionID eq '" + currentDataExtractionDate[0].DataExtractionID +
                                  "' and ControlSubmitted eq false and PriviligedUser/EMail eq '"
                                  + this.props.currentUserEmail +"'" )
                          .getAll().then(evaluationItems=>{
                            return evaluationItems;
                          })
    return res;
  }
  
  if(this.props.targetListID=='7f1efd48-2c02-4c72-a204-4dd978020b19')
  {
    let web = new Web(this.props.targetSiteUrl);
    // const currentUserDepartment = await web.lists.getById(this.props.targetListID).items
    // .select("Priveleged_x0020_User_x0020_Emai,Department")
    // .filter("Priveleged_x0020_User_x0020_Emai eq '" + this.props.currentUserEmail +"'")
    // .get().then(data=>{
    //   return data;
    // })
    // const currentUserDepartment = await web.lists.getById(this.props.targetListID).items
    // //.select("Priveleged_x0020_User_x0020_Emai,Department")
    // // .filter("Priveleged_x0020_User_x0020_Emai eq 'sola@LB.DK'")
    // .get().then(data=>{
    //   return data;
    // })
    
    const res = await web.lists
                          .getById(this.props.targetListID)
                          .items
                          .select("Privileged_x0020_User_x0020_Name," +
                                  "Privileged_x0020_User_x0020_Name/Id,"+
                                  "Privileged_x0020_User_x0020_Name/EMail,"+
                                  "Privileged_x0020_User_x0020_Name/FirstName,"+
                                  "Privileged_x0020_User_x0020_Name/LastName,"+
                                  "EmployeeRole",
                                  "Department")
                          .expand("Privileged_x0020_User_x0020_Name")
                          // .filter("PriviligedUser/EMail eq '"
                          //         + this.props.currentUserEmail +"'" )
                          .getAll().then(evaluationItems=>{
                            evaluationItems.map(user=>{
                              "STES@lb.dk".toUpperCase() == user.Privileged_x0020_User_x0020_Name.EMail.toUpperCase()?this.setState({currentUserDepartment:user.Department}):null
                            })
                            return evaluationItems;
                          })
    return res;
  }
}


  
//https://prismic.io/docs/reactjs/rendering/rich-text
  
}
