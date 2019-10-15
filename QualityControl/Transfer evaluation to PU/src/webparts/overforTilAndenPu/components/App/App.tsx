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
import { DefaultButton, PrimaryButton, Stack, IStackTokens } from 'office-ui-fabric-react';
import { ChoiceGroup, IChoiceGroupOption, ChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

export default class OverforTilAndenPu extends React.Component<IAppProps, IAppState > {
  private choiceGroup:any[] = [];
  
  public constructor(props:IAppProps,state:IAppState){  
      super(props);

      this.state= {
                      description:'',
                      priviledgedUsersItems:[],
                      currentUser:{},
                      evaluationItems:[],
                      currentUsersDepartment:'',
                      selectedEvaluations:[],
                      selectedUserId:null,
                      showGetEvaluationSpinner:true,
                      showGetUsersSpinner:true
                  }
      // this.getCurrentUserDepartment=this.getCurrentUserDepartment.bind(this)
      // // DEV list
      // // fc98c6c2-1d45-4502-aedd-970f39c474eb
      // // Prod list
      // // 433d918b-2e51-4ebb-ab2a-3fc9e2b5c540
      // let spService: SPService=new SPService(
      //   {
      //       targetListID:"fc98c6c2-1d45-4502-aedd-970f39c474eb",
      //       targetSiteUrl:"https://lbforsikring.sharepoint.com/sites/Skade",
      //       currentUserEmail:this.props.currentUserEmail
      //   }
      // );


      //   // var queryParms = new UrlQueryParameterCollection(window.location.href);
      //   // var myParm = queryParms.getValue("UserName");
      //   const res = spService.getListItemsByListID().then(data=>{
      //   this.setState({evaluationItems:data})
      //   })

      //   //********************************************************************* */
      //   //Privileged Users list 7f1efd48-2c02-4c72-a204-4dd978020b19
      //   //********************************************************************* */
      //   let spService2:SPService=new SPService(
      //     {
      //         targetListID:"7f1efd48-2c02-4c72-a204-4dd978020b19",
      //         targetSiteUrl:"https://lbforsikring.sharepoint.com/sites/Skade",
      //         currentUserEmail:this.props.currentUserEmail
      //     }
      //   );
      //   // Gets Priviliged Users
      //   const priviledgedUsersItems = spService2.getListItemsByListID().then(data=>{
      //     this.setState({priviledgedUsersItems:data},
      //                   this.getCurrentUserDepartment);
      //   })
        //********************************************************************* */
        this._initApp=this._initApp.bind(this);
        this._onSelectPriveledgeUserChange = this._onSelectPriveledgeUserChange.bind(this);
        this._onEvaluationCheckboxChanged=this._onEvaluationCheckboxChanged.bind(this);
        this._onClicked=this._onClicked.bind(this);

        this._initApp();
        
        
  }
  
  private async _onClicked():Promise< void> {
    let spService: SPService=new SPService(
      {
          targetListID:"fc98c6c2-1d45-4502-aedd-970f39c474eb",
          targetSiteUrl:"https://lbforsikring.sharepoint.com/sites/Skade",
          currentUserEmail:this.props.currentUserEmail
      }
    );
    const res = await spService.updateEvaluationItem(this.state.selectedEvaluations,this.state.selectedUserId).then((data)=>{
      this._initApp();
      this.render();
      
      
    })

    
    
    
  }
  
  private _initApp(){
    
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
      this.setState({evaluationItems:data,showGetEvaluationSpinner:false})
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
        this.setState({priviledgedUsersItems:data,showGetUsersSpinner:false},
                      this.getCurrentUserDepartment);
      })

  }
  public _onSelectPriveledgeUserChange(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption): void 
  {
    this.setState({selectedUserId:parseInt( option.key)})
    console.log(option.key)
  }
  private getCurrentUserDepartment():void{
    let currentDepartment:string="";
    this.state.priviledgedUsersItems.map(items=>{
      
        this.props.currentUserEmail.toUpperCase()==items.Privileged_x0020_User_x0020_Name.EMail.toUpperCase()?
          currentDepartment=items.Department:null
      });

      this.state.priviledgedUsersItems.map(items=>{
        items.Department.toUpperCase()==currentDepartment.toUpperCase()?
        items.EmployeeRole.toUpperCase()=="PRIVILIGED USER"?
        this.choiceGroup.push({
            key :items.Privileged_x0020_User_x0020_Name.Id,
            text: items.Privileged_x0020_User_x0020_Name.FirstName + " " +items.Privileged_x0020_User_x0020_Name.LastName
          }):null:null
      });


          
  }
  public _onEvaluationCheckboxChanged(listItemId:number, isChecked:boolean){
    if(this.state.selectedEvaluations!== undefined){
    let newArray = this.state.selectedEvaluations;
    

    if(newArray.indexOf(listItemId) < 0 && isChecked == true){
      newArray.push(listItemId);
      this.setState({selectedEvaluations:newArray})
    }
    else if(newArray.indexOf(listItemId)>-1 && isChecked == false){
      newArray.splice(newArray.indexOf(listItemId),1)
      this.setState({selectedEvaluations:newArray})
    }

      console.log(listItemId);
      console.log(isChecked);
      console.log(this.state.selectedEvaluations);
    }
      
  }
  public render(): React.ReactElement<IAppProps> {
    return (
      <div className={ styles.App }>
        <div className={ styles.container }>
          <div className={ styles.row }>
         
            <div className={ styles.column }>
              
              <div className={styles.columnHeader}>Vælg evalueringer der skal tildeles anden Priviliged user.</div>
              {
                this.state.showGetEvaluationSpinner==true? 
                <div>
                  <Spinner size={SpinnerSize.large} label="Henter evalueringer" />
                </div>:
                this.state.evaluationItems.map(item=>{
                  return(
                    <div className={ styles.row }>
                      <EvaluationRow  ID={item.ID} 
                                      claimID={item.ClaimID} 
                                      employeeInFocusDisplayName={item.EmployeeInFocusDisplayName}
                                      checkboxChangedCallBack={this._onEvaluationCheckboxChanged}
                                      />
                    </div>
                      
                  )
                })
              }
            </div>
            
            <div className={ styles.column }>
            <div className={styles.columnHeader}>Vælg Priviledged user der skal overtage de valgte evalueringer.</div>
            {
              this.state.showGetUsersSpinner==true? 
                <div>
                  <Spinner size={SpinnerSize.large} label="Henter Priviledged users" />
                </div>:
              <ChoiceGroup
                className={styles.customChoiceGroup}
                // defaultSelectedKey="B"
                options={this.choiceGroup}
                onChange={this._onSelectPriveledgeUserChange}
                // label="Pick one"
                required={true}
              />
            }
            </div>
            
           
          </div>
          <div className={ styles.buttonRow }>
              <PrimaryButton  text="Overfør evalueringer" 
                              onClick={this._onClicked} 
                              // allowDisabledFocus 
                              // disabled={disabled} 
                              // checked={checked} 
                              />
          </div>
        </div>
      </div>
    );
  }
}
