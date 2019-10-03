import * as React from 'react';
import styles from './App.module.scss'
import { IAppProps } from './IAppProps';
import { IAppState } from './IAppState';
import { escape } from '@microsoft/sp-lodash-subset';
import SPService from "../../services/SPService"
import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';
import { sp } from "@pnp/sp";
import { ICurrentUser } from '../../Interfaces/ICurrentUser';
import EvaluationRow from '../EvaluationRow/EvaluationRow'

import { ChoiceGroup, IChoiceGroupOption, ChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';


export default class OverforTilAndenPu extends React.Component<IAppProps, IAppState > {
  private choiceGroup:any[] = [];
  public constructor(props:IAppProps,state:IAppState){  
      super(props);

      this.state= {
                      description:'',
                      priviledgedUsersItems:[],
                      currentUser:{},
                      evaluationItems:[],
                      currentUsersDepartment:''
                  }
      this.getCurrentUserDepartment=this.getCurrentUserDepartment.bind(this)
      // DEV list
      // fc98c6c2-1d45-4502-aedd-970f39c474eb
      // Prod list
      // 433d918b-2e51-4ebb-ab2a-3fc9e2b5c540
      let spService: SPService=new SPService(
        {
            targetListID:"fc98c6c2-1d45-4502-aedd-970f39c474eb",
            targetSiteUrl:"https://lbforsikring.sharepoint.com/sites/Skade",
            currentUserEmail:this.props.currentUserEmail
        }
      );


        // var queryParms = new UrlQueryParameterCollection(window.location.href);
        // var myParm = queryParms.getValue("UserName");
        const res = spService.getListItemsByListID().then(data=>{
        this.setState({evaluationItems:data})
        })

        //********************************************************************* */
        //Privileged Users list 7f1efd48-2c02-4c72-a204-4dd978020b19
        //********************************************************************* */
        let spService2:SPService=new SPService(
          {
              targetListID:"7f1efd48-2c02-4c72-a204-4dd978020b19",
              targetSiteUrl:"https://lbforsikring.sharepoint.com/sites/Skade",
              currentUserEmail:this.props.currentUserEmail
          }
        );
        // Gets Priviliged Users
        const priviledgedUsersItems = spService2.getListItemsByListID().then(data=>{
          this.setState({priviledgedUsersItems:data},
                        this.getCurrentUserDepartment);
        })
        //********************************************************************* */
        
        
  }
  private getCurrentUserDepartment():void{
    let currentDepartment:string="";
    this.state.priviledgedUsersItems.map(items=>{
      
        "yvpe@lb.dk".toUpperCase()==items.Privileged_x0020_User_x0020_Name.EMail.toUpperCase()?
          currentDepartment=items.Department:null
      });

      this.state.priviledgedUsersItems.map(items=>{
        items.Department.toUpperCase()==currentDepartment.toUpperCase()?
        this.choiceGroup.push({
            key :items.Privileged_x0020_User_x0020_Name.EMail,
            text: items.Privileged_x0020_User_x0020_Name.FirstName + " " +items.Privileged_x0020_User_x0020_Name.LastName + " - " + items.EmployeeRole
          }):null
      });


          
  }
  public render(): React.ReactElement<IAppProps> {
    return (
      <div className={ styles.App }>
        <div className={ styles.container }>
          <div className={ styles.row }>
         
            <div className={ styles.column }>
              {
                this.state.evaluationItems.map(item=>{
                  return(
                    <div className={ styles.row }>
                      <EvaluationRow  ID={item.ID} 
                                      claimID={item.ClaimID} 
                                      employeeInFocusDisplayName={item.EmployeeInFocusDisplayName}
                                      />
                    </div>
                      
                  )
                })
              }
            </div>
            <div className={ styles.column }>
              
            </div>
            <div className={ styles.column }>
              <ChoiceGroup
                className="defaultChoiceGroup"
                // defaultSelectedKey="B"
                options={this.choiceGroup}
                // onChange={_onChange}
                // label="Pick one"
                required={true}
              />
            </div>
            
            
            {/* <div className={ styles.column }>
            {
              this.state.priviledgedUsersItems.map(item=>{
                  return(
                    <div className={ styles.row }>
                      <EvaluationRow userFirstName={item.Privileged_x0020_User_x0020_Name.FirstName} 
                      userLastName={item.Privileged_x0020_User_x0020_Name.LastName} 
                      userEmail={item.Privileged_x0020_User_x0020_Name.EMail}>

                      </EvaluationRow>
                     
                    </div>
                  )
              })
            }
          </div> */}
          </div>
        </div>
      </div>
    );
  }
}
