import {Web } from "@pnp/sp";
import * as React from 'react';
import { ISPServiceProps } from './ISPServiceProps'
export default class SPService extends React.Component<ISPServiceProps> {
  public constructor(props:ISPServiceProps){  
    super(props);
    this.state={
      currentUserDepartment:''
    }
   
}

public async updateEvaluationItem(listItemIDs:number[],priviledgedUserId:number):Promise<void>{
  let web = new Web(this.props.targetSiteUrl);

  const promises = listItemIDs.map(async listItemID=>{
      const _promise= await web.lists.getById(this.props.targetListID)
              .items
              .getById(listItemID)
              .update({"PriviligedUserId":priviledgedUserId});
              return _promise;
            });

  const results = await Promise.all(promises);
  
              
}

public async getListItemsByListID():Promise<any>{
  const DEV_EVALUATIONS_LIST_ID = 'fc98c6c2-1d45-4502-aedd-970f39c474eb';
  const PRIVILEDGED_USERS_LIST_ID = '7f1efd48-2c02-4c72-a204-4dd978020b19';
  
  if(this.props.targetListID==DEV_EVALUATIONS_LIST_ID)
  {
    /***********************************************************************
     *  Getting the latest DataExtractionID filtered by DataExtractionDate
     ***********************************************************************/
    let web = new Web(this.props.targetSiteUrl);
    const currentDataExtractionDate = await web.lists.getById(this.props.targetListID)
                                                .items
                                                .select("DataExtractionID")
                                                .orderBy('DataExtractionDate',false)
                                                .top(1).get().then(data=>{
        return data;
    });
    
    /***********************************************************************
     * Getting all the latest evaluations assigned to the current user that
     * has not been committed
     * *********************************************************************/
    const CURRENT_DATAEXTRACTION_ID = currentDataExtractionDate[0].DataExtractionID;
    const res = await web.lists
                        .getById(this.props.targetListID)
                        .items
                        .select("ID,DataExtractionID,ClaimID,EmployeeInFocusDisplayName,ControlSubmitted,PriviligedUser/Id,PriviligedUser/EMail")
                        .expand("PriviligedUser")
                        .filter("DataExtractionID eq '" + CURRENT_DATAEXTRACTION_ID +
                                "' and ControlSubmitted eq false and PriviligedUser/EMail eq '"
                                + this.props.currentUserEmail +"'" )
                        .getAll().then(evaluationItems=>{
                          return evaluationItems;
                        });

    return res;
  }
  
  if(this.props.targetListID==PRIVILEDGED_USERS_LIST_ID)
  {
    let web = new Web(this.props.targetSiteUrl);
    
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
                          .getAll().then(evaluationItems=>{
                            evaluationItems.map(user=>{
                              this.props.currentUserEmail.toUpperCase() == user.Privileged_x0020_User_x0020_Name.EMail.toUpperCase()
                                        ?this.setState({currentUserDepartment:user.Department})
                                        :null
                            })
                            return evaluationItems;
                          })
    return res;
  }


}

public async getPriviledgedUsers(listId:string):Promise<any>{

    let web = new Web(this.props.targetSiteUrl);
    
    const res = await web.lists
                          .getById(listId)
                          .items
                          .select("Privileged_x0020_User_x0020_Name," +
                                  "Privileged_x0020_User_x0020_Name/Id,"+
                                  "Privileged_x0020_User_x0020_Name/EMail,"+
                                  "Privileged_x0020_User_x0020_Name/FirstName,"+
                                  "Privileged_x0020_User_x0020_Name/LastName,"+
                                  "EmployeeRole",
                                  "Department")
                          .expand("Privileged_x0020_User_x0020_Name")
                          .getAll().then(evaluationItems=>{
                            evaluationItems.map(user=>{
                              this.props.currentUserEmail.toUpperCase() == user.Privileged_x0020_User_x0020_Name.EMail.toUpperCase()
                                        ?this.setState({currentUserDepartment:user.Department})
                                        :null
                            })
                            return evaluationItems;
                          })
    return res;

}
public async getEvaluations(listId:string):Promise<any>{
  
  if(this.props.targetListID==listId)
  {
    /***********************************************************************
     *  Getting the latest DataExtractionID filtered by DataExtractionDate
     ***********************************************************************/
    let web = new Web(this.props.targetSiteUrl);
    const currentDataExtractionDate = await web.lists.getById(this.props.targetListID)
                                                .items
                                                .select("DataExtractionID")
                                                .orderBy('DataExtractionDate',false)
                                                .top(1).get().then(data=>{
        return data;
    });
    
    /***********************************************************************
     * Getting all the latest evaluations assigned to the current user that
     * has not been committed
     * *********************************************************************/
    const CURRENT_DATAEXTRACTION_ID = currentDataExtractionDate[0].DataExtractionID;
    const res = await web.lists
                        .getById(this.props.targetListID)
                        .items
                        .select("ID,DataExtractionID,ClaimID,EmployeeInFocusDisplayName,ControlSubmitted,PriviligedUser/Id,PriviligedUser/EMail")
                        .expand("PriviligedUser")
                        .filter("DataExtractionID eq '" + CURRENT_DATAEXTRACTION_ID +
                                "' and ControlSubmitted eq false and PriviligedUser/EMail eq '"
                                + this.props.currentUserEmail +"'" )
                        .getAll().then(evaluationItems=>{
                          return evaluationItems;
                        });

    return res;
  }
  
}


  
//https://prismic.io/docs/reactjs/rendering/rich-text
  
}
