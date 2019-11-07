import * as React from 'react';
import styles from './App.module.scss'
import { IAppProps } from './IAppProps';
import { IAppState } from './IAppState';
import SPService from "../../services/SPService"
import EvaluationRow from '../EvaluationRow/EvaluationRow'
import { PrimaryButton } from 'office-ui-fabric-react';
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
                      showGetUsersSpinner:true,
                      isUpdatedCompletted:false,
                      isUpdating:false
                  }
      
      
        this._initApp=this._initApp.bind(this);
        this._onSelectPriviledgeUserChange = this._onSelectPriviledgeUserChange.bind(this);
        this._onEvaluationCheckboxChanged=this._onEvaluationCheckboxChanged.bind(this);
        this.buildPriviligedUsersRadioGroup=this.buildPriviligedUsersRadioGroup.bind(this);
        this._onClicked=this._onClicked.bind(this);

        this._initApp();
        
        
  }
  
  private async _onClicked():Promise< void> {
    
    let spService: SPService=new SPService(
      {
          targetListID:this.props.evaluationsListId,
          targetSiteUrl:this.props.siteUrl,
          currentUserEmail:this.props.currentUserEmail
      }
    );
    const res = await spService.updateEvaluationItem(this.state.selectedEvaluations,this.state.selectedUserId).then(async (data)=>{
      this.setState({selectedEvaluations:[],selectedUserId:null});
      const res2 = await this._initApp().then(()=>{
        this.setState({isUpdating:false})
      });
      
    })
  }
  
  private async _initApp():Promise<void>{
    //   this.state= {
    //     description:'',
    //     priviledgedUsersItems:[],
    //     currentUser:{},
    //     evaluationItems:[],
    //     currentUsersDepartment:'',
    //     selectedEvaluations:[],
    //     selectedUserId:null,
    //     showGetEvaluationSpinner:true,
    //     showGetUsersSpinner:true,
    //     isUpdatedCompletted:false,
    //     isUpdating:false
    // }
    
    /******************************************************************
    * Initializing spService object
    * DEV list
    * fc98c6c2-1d45-4502-aedd-970f39c474eb
    * Prod list
    * 433d918b-2e51-4ebb-ab2a-3fc9e2b5c540
    ******************************************************************/
    let spGetEvaluationsService: SPService=new SPService(
      {
          targetListID:this.props.evaluationsListId,
          targetSiteUrl:this.props.siteUrl,
          currentUserEmail:this.props.currentUserEmail
      }
    );

    /*********************************************************************
    * Initializing spService object
    * Privileged Users list 7f1efd48-2c02-4c72-a204-4dd978020b19
    ********************************************************************* */
    let spGetPrivilegedUsersService:SPService=new SPService(
      {
        targetListID:this.props.priviledgeUsersListId,
        targetSiteUrl:this.props.siteUrl,
        currentUserEmail:this.props.currentUserEmail
      }
    );
    /************************************************************************************
     * Getting list all evaluations filtered by the latest DataExtractionID, and getting 
     * all employees from the current department
    ************************************************************************************/
    const promiseEvaluations =await spGetEvaluationsService.getEvaluations(this.props.evaluationsListId);
    const promisePriviledgedUsers=await spGetPrivilegedUsersService.getPriviledgedUsers(this.props.priviledgeUsersListId)

    const results = await Promise.all([promiseEvaluations,promisePriviledgedUsers]).then(()=>{



      this.buildPriviligedUsersRadioGroup(promisePriviledgedUsers);

      this.setState({ evaluationItems:promiseEvaluations,
        showGetEvaluationSpinner:false,
        priviledgedUsersItems:promisePriviledgedUsers,
        showGetUsersSpinner:false})    

    });  

  }
  
  public _onSelectPriviledgeUserChange(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption): void 
  {
    this.setState({selectedUserId:parseInt( option.key)})
  }

  private  buildPriviligedUsersRadioGroup(emps:any):void{
    let currentDepartment:string="";
    this.choiceGroup=[];
    emps.map(items=>{
      
        this.props.currentUserEmail.toUpperCase()==items.Privileged_x0020_User_x0020_Name.EMail.toUpperCase()?
          currentDepartment=items.Department:null
      });
      
      emps.map(items=>{
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
    }
  }

  private _getUpdateSpinner():JSX.Element{

    
     return(this.state.isUpdating==true && this.state.isUpdatedCompletted==false ? 
              <div>
                <Spinner size={SpinnerSize.large} label="Flytter sag..." />
              </div>
              :this.state.isUpdating==true && this.state.isUpdatedCompletted==true?
              <div>
                <Spinner size={SpinnerSize.large} label="Sagen er flyttet..." />
              </div>:null)
  }
  private _getLoadingSpinner():JSX.Element{
    return(this.state.isUpdating==true && this.state.isUpdatedCompletted==false ? 
             <div>
               <Spinner size={SpinnerSize.large} label="Flytter sag..." />
             </div>
             :this.state.isUpdating==true && this.state.isUpdatedCompletted==true?
             <div>
               <Spinner size={SpinnerSize.large} label="Sagen er flyttet..." />
             </div>:null)
 }
  public render(): React.ReactElement<IAppProps> {
    
    return (
      <div className={ styles.App }>
        <div className={ styles.container }>
            <div className={ styles.row }>
              {
                this._getUpdateSpinner()
              }
                  
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
                  onChange={this._onSelectPriviledgeUserChange}
                  // label="Pick one"
                  required={true}
                />
              }
              </div>
              
            
            </div>
                                  
            <div className={ styles.buttonRow }>
              <PrimaryButton  text="Overfør evalueringer" 
                              onClick={this._onClicked} 
                              
                              />
            </div>
          
          
          
        </div>
      </div>
    );
  }
}
