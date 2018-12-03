import * as React from 'react';
import styles from './App.module.scss';
import {  UrlQueryParameterCollection } from '@microsoft/sp-core-library';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';

import { DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { IAppProps } from './IAppProps';
import pnp, { setup} from "sp-pnp-js";
import { IAppState } from './IAppState';
import { IAnswer } from '../../Interfaces/IAnswer';
import { IQuestions } from '../../Interfaces/IQuestions';
import { IQCUser } from '../../Interfaces/IQCUser';
import { IUserRoles } from '../../Interfaces/IUserRole';
import QuestionItem from '../QuestionItem/QuestionItem';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { ICurrentUser } from '../../../../Interfaces/ICurrentUser.';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { SiteUsers, SiteUser } from 'sp-pnp-js/lib/sharepoint/siteusers';
import { IUser } from '../../../../../lib/webparts/qualityControlQuestionaire/Interfaces/IUser';


let employeeInFocus:IQCUser={
    name:'',
    email:''
    // userRole:IUserRoles.Employee
};
let priviligedUser:IQCUser={
    name:'',
    email:''
    // userRole:IUserRoles.PriviligedUser
};
let updatableitemInContext: IAnswer = {
    // listItemId:null,
    // batchID:'',
    // claimID:'',
    // department:'',
    // employeeInFocus:employeeInFocus,
    // priviligedUser:priviligedUser,
    // answer1:true,
    // answer1Description:'',
    // answer2:true,
    // answer2Description:'',
    // answer3:true,
    // answer3Description:'',
    // answer4:true,
    // answer4Description:'',
    // answer5:true,
    // answer5Description:'',
    // answer6:0
};
//https://lbforsikring.sharepoint.com/sites/Skade/Lists/Quality%20Control%20%20Claims%20Handler%20Questions/
const QUESTIONS_LIST_ID = 'ad5ea1c8-3321-4a16-bc06-39a3b03d9e20';

//https://lbforsikring.sharepoint.com/sites/Skade/Lists/Quality%20Control%20%20Claims%20Handler%20Answers/AllItems.aspx
const ANSWERS_LIST_ID = '433d918b-2e51-4ebb-ab2a-3fc9e2b5c540';

export default class App extends React.Component<IAppProps, IAppState> {

    
    constructor(props: IAppProps,state: IAppState) {
        super(props);
        
        this.state = {
            itemInContext:{},
            employeeInFocus:{},
            showPanel:false,
            currentAnswerId:0,
            currentUser:{},
            answersList:[],
            questions:{
                Q1:'',
                Q2:'',
                Q3:'',
                Q4:'',
                Q5:'',
                Q6:''
            },
            answers:{
                // batchID:'',
                // claimID:'',
                // department:'',
                // priviligedUser:priviligedUser,
                // employeeInFocus:employeeInFocus,
                // listItemId:0,
                // answer1:true,
                // answer1Description:'',
                // answer2:true,
                // answer2Description:'',
                // answer3:true,
                // answer3Description:'',
                // answer4:true,
                // answer4Description:'',
                // answer5:true,
                // answer5Description:'',
                // answer6:0
            }
        }

        setup({
            sp: {
                headers: {
                    Accept: "application/json;"
                },
                baseUrl: "https://lbforsikring.sharepoint.com/sites/skade"
            },
            
        });
        
        this._getEmployeeInFocusProps=this._getEmployeeInFocusProps.bind(this);
        this._getQuestions=this._getQuestions.bind(this);
        this._getAnswers=this._getAnswers.bind(this);
        this._onBtnClick=this._onBtnClick.bind(this);
        this._setItemInContext=this._setItemInContext.bind(this);
        // this.saveAnswer=this.saveAnswer.bind(this);
        this._onChange=this._onChange.bind(this);
        this._updateAnswers=this._updateAnswers.bind(this);
        this._getUserObject=this._getUserObject.bind(this);
        this._onDismissPanel=this._onDismissPanel.bind(this);
        // this._resolveUserIdtoUserName=this._resolveUserIdtoUserName.bind(this);
        const pQuestions= this._getQuestions();

        pQuestions.then((t)=>{
            let res:IQuestions={
                Q1:'',
                Q2:'',
                Q3:'',
                Q4:'',
                Q5:'',
                Q6:''
            };
        
            res.Q1=t[0].ControlQuestion;
            res.Q2=t[1].ControlQuestion;
            res.Q3=t[2].ControlQuestion;
            res.Q4=t[3].ControlQuestion;
            res.Q5=t[4].ControlQuestion;
            res.Q6=t[5].ControlQuestion;
        
            this.setState({questions:res})
            }
        )
        
        const pUser = this._getUserObject()
        pUser.then(
            this._getAnswers
        )
    }
    
    //https://github.com/pnp/pnpjs/issues/196#issuecomment-410908170
    public _onBtnClick(submitAnswer:boolean):void{
        this._updateAnswers(submitAnswer);
        // this.setState({answers:itemInContext},this._updateAnswers);
    }
    
    public async _getQuestions(): Promise<any> {
        // Quality Control - Claims Handler Questions
        // return await pnp.sp.web.lists.getByTitle('QualityControl-10Sagsgennemgang')
        return await pnp.sp.web.lists.getById(QUESTIONS_LIST_ID)
            .items
            .orderBy('Sortering')
            .get()
            .then((data: any) => {
                console.log(data)
                return data;
                // this.setState({items:data})
            }
        )
    }
    
    
    public async _updateAnswers(submitAnswer:boolean): Promise<void> {
        
        pnp.sp.web.lists.getById(ANSWERS_LIST_ID).items.getById(updatableitemInContext.listItemId).update({
            Title: updatableitemInContext.claimID,
            Answer1:updatableitemInContext.answer1,
            Answer1Description:updatableitemInContext.answer1Description,
            Answer1Remark:updatableitemInContext.answer1Remark,
            Answer2:updatableitemInContext.answer2,
            Answer2Description:updatableitemInContext.answer2Description,
            Answer2Remark:updatableitemInContext.answer2Remark,
            Answer3:updatableitemInContext.answer3,
            Answer3Description:updatableitemInContext.answer3Description,
            Answer3Remark:updatableitemInContext.answer3Remark,
            Answer4:updatableitemInContext.answer4,
            Answer4Description:updatableitemInContext.answer4Description,
            Answer4Remark:updatableitemInContext.answer4Remark,
            Answer5:updatableitemInContext.answer5,
            Answer5Description:updatableitemInContext.answer5Description,
            Answer5Remark:updatableitemInContext.answer5Remark,
            Answer6:updatableitemInContext.answer6,
            Answer6Description:updatableitemInContext.answer6Description,
            Answer6Remark:updatableitemInContext.answer6Remark,
            ConcludingRemark:updatableitemInContext.ConcludingRemark,
            ConcludingDescription:updatableitemInContext.ConcludingDescription,
            ControlSubmitted:submitAnswer
        }).then(r => {
            this.setState({showPanel:!this.state.showPanel})
            console.log(r);
        });
    }
    private _groupBy(prop:string,arr:IAnswer[]):any{
        
        var groupBy = require('lodash.groupby');
        return groupBy(arr,prop);

        // return groupArray(arr,prop);
        
      }
    public async _getAnswers(): Promise<void> {
        let answersitems:IAnswer[]=[];
        let employeeInFocus:IQCUser={
            email:'',
            name:''
        }
        // Quality Control - Claims Handler Questions
        // return await pnp.sp.web.lists.getByTitle('QualityControl-10Sagsgennemgang')
        await pnp.sp.web.lists.getById(ANSWERS_LIST_ID)
            .items
            .filter("PriviligedUser eq "+ this.state.currentUser.id + " and ControlSubmitted eq 0")
            .get()
            .then(async (data: any[]) => {
                console.log(data)
                
                data.map(async (item)=>{
                    // const userPromise =await  pnp.sp.web.siteUsers.getById(item.EmployeeInFocusId).get().then((data)=>{
                    //     return data;
                    // }
                    // );
                    
                    answersitems.push(  {
                                            claimID:item.ClaimID,
                                            listItemId:item.Id,
                                            employeeInFocus:employeeInFocus,
                                            answer1:item.Answer1,
                                            answer1Remark:item.Answer1Remark,
                                            answer1Description:item.Answer1Description,
                                            answer2:item.Answer2,
                                            answer2Remark:item.Answer2Remark,
                                            answer2Description:item.Answer2Description,
                                            answer3:item.Answer3,
                                            answer3Remark:item.Answer3Remark,
                                            answer3Description:item.Answer3Description,
                                            answer4:item.Answer4,
                                            answer4Remark:item.Answer4Remark,
                                            answer4Description:item.Answer4Description,
                                            answer5:item.Answer5,
                                            answer5Remark:item.Answer5Remark,
                                            answer5Description:item.Answer5Description,
                                            answer6:item.Answer6,
                                            answer6Remark:item.Answer6Remark,
                                            ConcludingRemark:item.ConcludingRemark,
                                            ConcludingDescription:item.ConcludingDescription,
                                            employeeInFocusDisplayName:item.EmployeeInFocusDisplayName
                                        }
                                    )
                })
                this.setState({answersList:answersitems})
            }
        )
        // const r = await this._getPriviligedUser(data[0].PriviligedUserId);
    }
    private async _getUserObject(): Promise<any> {
        try {
            
            return pnp.sp.web.currentUser.get().then(result => {
                let currentUser:ICurrentUser={
                    displayName:result.Title,
                    email:result.Email,
                    id:result.Id,
                };
                this.setState({currentUser:currentUser});    
                return result
                
            });
        } catch (error) {
            console.log(error)
        }

    }
    
    private _setItemInContext(answerId:number):any{

        this.state.answersList.map((answer)=>{
                answer.listItemId == answerId?
                        this.setState({itemInContext:answer},
                            ()=>{
                                    updatableitemInContext = this.state.itemInContext;
                                    this.setState({showPanel:!this.state.showPanel},()=>{
                                });
                                }
                            )
                        :null
        })
        
    }
    private async _resolveUserId(id:number):Promise<void>{
        let empInFocus:IQCUser={
            name:'',
            email:''
            // userRole:IUserRoles.Employee
        };
        const promiseResult = await this._getEmployeeInFocusProps(id)
        empInFocus.name=promiseResult.Title
        empInFocus.email=promiseResult.email
        this.setState({employeeInFocus:empInFocus})
    }
    
    private _onDismissPanel():void{
        
        this.setState({ showPanel: false },
        this._getAnswers)
    }
    private async _getEmployeeInFocusProps(userId:number):Promise<any>{
        
        return pnp.sp.web.siteUsers.getById(userId).get().then((promise)=>{
            return promise;
        });
    }
    public render(): React.ReactElement<IAppProps> {
        var groupedManuals:any;
        
        groupedManuals=this._groupBy('EmployeeInFocusDisplayName',this.state.answersList)
        var arrGroupKeys:string[]=[];
        
        Object.keys(groupedManuals).map((groupKey,i)=>{
            arrGroupKeys.push(groupKey);
        });

        return (
            
        <div>
            {this.props.webPartHeader?this.props.webPartHeader.length>0?
            <div className={ styles.webPartHeader}>{this.props.webPartHeader}</div>:null:null
            }
            
             <div >
             
                {
                    
                    this.state.answersList.map((ans)=>{
                    return(<div className={styles.claimControlRow} 
                                onClick={()=>{
                                                this._setItemInContext(ans.listItemId);
                                                // this._resolveUserId(ans.employeeInFocusID)
                                            }}>
                                            <div id={"listItemID" + ans.listItemId}></div>
                                            
                                            {ans.claimID +":" + ans.employeeInFocusDisplayName}
                                            {/* {this._resolveUserIdtoUserName(ans.employeeInFocusID,ans.listItemId.toString())} */}
                            </div>)
                })}
        <Panel
          isOpen={this.state.showPanel}
          onDismiss={() => this._onDismissPanel()}
          type={PanelType.extraLarge}
          closeButtonAriaLabel="Close"
        >           
            <div className={[styles.row, styles.header].join(' ') }>
                <div>Quality Control - ClaimID: <b>{updatableitemInContext.claimID}</b></div>
                {/* <div>Medarbejder i fokus: {updatableitemInContext.employeeInFocus}</div>                 */}
                {/* <div>Medarbejder i fokus: {this.state.employeeInFocus.name}</div>                 */}
            </div> 
            {/************************************* Question 1 *************************************/}
            <div className={ styles.question}>
                <Toggle
                defaultChecked={updatableitemInContext.answer1}
                label={this.state.questions.Q1}
                onText="Ja"
                offText="Nej"
                onChanged={(answer1)=>{
                    updatableitemInContext.answer1=answer1;
                    if(!answer1){
                        updatableitemInContext.answer1Description ='';
                        updatableitemInContext.answer1Remark=0;
                    }
                    this.setState({answers:updatableitemInContext})
                }}
                />
                <div className={updatableitemInContext.answer1?styles.descriptionTextFieldHidden:styles.descriptionTextFieldVisible} >
                    <TextField  
                        className={updatableitemInContext.answer1?styles.descriptionTextFieldHidden:styles.descriptionTextFieldVisible} 
                        label="Hvis nej så uddyb" 
                        multiline rows={4} 
                        value={updatableitemInContext.answer1Description}  
                        onChanged={(input)=>updatableitemInContext.answer1Description=input}
                        />
                    <ChoiceGroup
                        defaultSelectedKey={updatableitemInContext.answer1Remark==0?"1None":
                                                updatableitemInContext.answer1Remark==1?"1Blue":
                                                    updatableitemInContext.answer1Remark==2?"1Yellow":
                                                        updatableitemInContext.answer1Remark==3?"1Red":""}

                        options={[
                        {
                            key: '1None',
                            text: 'Ingen bemærkninger'
                            
                        } as IChoiceGroupOption,
                        {
                        key: '1Blue',
                        text: 'Blå'
                        },
                        {
                            key: '1Yellow',
                            text: 'Gul'
                        },
                        {
                            key: '1Red',
                            text: 'Rød'
                        }
                    ]}
                        onChange={this._onChange}
                        label="Angiv bemærkning"
                    />
                    
                </div>
            </div>
            {/************************************* Question 2 *************************************/}
            <div className={ styles.question}>
                <Toggle
                defaultChecked={updatableitemInContext.answer2}
                label={this.state.questions.Q2}
                onText="Ja"
                offText="Nej"
                onChanged={(answer2)=>{
                    updatableitemInContext.answer2=answer2;
                    if(!answer2){
                        updatableitemInContext.answer2Description ='';
                        updatableitemInContext.answer2Remark=0;
                    }
                    this.setState({answers:updatableitemInContext})
                }}
                />
                <div className={updatableitemInContext.answer2?styles.descriptionTextFieldHidden:styles.descriptionTextFieldVisible} >
                    <TextField  
                        className={updatableitemInContext.answer2?styles.descriptionTextFieldHidden:styles.descriptionTextFieldVisible} 
                        label="Hvis nej så uddyb" 
                        multiline rows={4} 
                        value={updatableitemInContext.answer2Description}  
                        onChanged={(input)=>updatableitemInContext.answer2Description=input}
                        />
                    <ChoiceGroup
                        defaultSelectedKey={updatableitemInContext.answer2Remark==0?"2None":
                                                updatableitemInContext.answer2Remark==1?"2Blue":
                                                    updatableitemInContext.answer2Remark==2?"2Yellow":
                                                        updatableitemInContext.answer2Remark==3?"2Red":""}

                        options={[
                        {
                            key: '2None',
                            text: 'Ingen bemærkninger'
                            
                        } as IChoiceGroupOption,
                        {
                        key: '2Blue',
                        text: 'Blå'
                        },
                        {
                            key: '2Yellow',
                            text: 'Gul'
                        },
                        {
                            key: '2Red',
                            text: 'Rød'
                        }
                    ]}
                        onChange={this._onChange}
                        label="Angiv bemærkning"
                    />
                    
                </div>
            </div>
            {/************************************* Question 3 *************************************/}
            <div className={ styles.question}>
                <Toggle
                defaultChecked={updatableitemInContext.answer3}
                label={this.state.questions.Q3}
                onText="Ja"
                offText="Nej"
                onChanged={(answer3)=>{
                    updatableitemInContext.answer3=answer3;
                    if(!answer3){
                        updatableitemInContext.answer3Description ='';
                    }
                    this.setState({answers:updatableitemInContext})
                }}
                />
                <div className={updatableitemInContext.answer3?styles.descriptionTextFieldHidden:styles.descriptionTextFieldVisible} >
                <TextField  
                        className={updatableitemInContext.answer3?styles.descriptionTextFieldHidden:styles.descriptionTextFieldVisible} 
                        label="Hvis nej så uddyb" 
                        multiline rows={4} 
                        value={updatableitemInContext.answer3Description}  
                        onChanged={(input)=>updatableitemInContext.answer3Description=input}
                        />
                    <ChoiceGroup
                        defaultSelectedKey={updatableitemInContext.answer3Remark==0?"3None":
                                                updatableitemInContext.answer3Remark==1?"3Blue":
                                                    updatableitemInContext.answer3Remark==2?"3Yellow":
                                                        updatableitemInContext.answer3Remark==3?"3Red":""}

                        options={[
                        {
                            key: '3None',
                            text: 'Ingen bemærkninger'
                            
                        } as IChoiceGroupOption,
                        {
                        key: '3Blue',
                        text: 'Blå'
                        },
                        {
                            key: '3Yellow',
                            text: 'Gul'
                        },
                        {
                            key: '3Red',
                            text: 'Rød'
                        }
                    ]}
                        onChange={this._onChange}
                        label="Angiv bemærkning"
                    />
                    
                </div>
            </div>

            {/************************************* Question 4 *************************************/}
            <div className={ styles.question}>
                <Toggle
                defaultChecked={updatableitemInContext.answer4}
                label={this.state.questions.Q4}
                onText="Ja"
                offText="Nej"
                onChanged={(answer4)=>{
                    updatableitemInContext.answer4=answer4;
                    if(!answer4){
                        updatableitemInContext.answer4Description ='';
                    }
                    this.setState({answers:updatableitemInContext})
                }}
                />
                <div className={updatableitemInContext.answer4?styles.descriptionTextFieldHidden:styles.descriptionTextFieldVisible} >
                <TextField  
                        className={updatableitemInContext.answer4?styles.descriptionTextFieldHidden:styles.descriptionTextFieldVisible} 
                        label="Hvis nej så uddyb" 
                        multiline rows={4} 
                        value={updatableitemInContext.answer4Description}  
                        onChanged={(input)=>updatableitemInContext.answer4Description=input}
                        />
                        <ChoiceGroup
                        defaultSelectedKey={updatableitemInContext.answer4Remark==0?"4None":
                                                updatableitemInContext.answer4Remark==1?"4Blue":
                                                    updatableitemInContext.answer4Remark==2?"4Yellow":
                                                        updatableitemInContext.answer4Remark==3?"4Red":""}

                        options={[
                        {
                            key: '4None',
                            text: 'Ingen bemærkninger'
                            
                        } as IChoiceGroupOption,
                        {
                        key: '4Blue',
                        text: 'Blå'
                        },
                        {
                            key: '4Yellow',
                            text: 'Gul'
                        },
                        {
                            key: '4Red',
                            text: 'Rød'
                        }
                    ]}
                        onChange={this._onChange}
                        label="Angiv bemærkning"
                    />
                    
                </div>
            </div>

            {/************************************* Question 5 *************************************/}
            <div className={ styles.question}>
                <Toggle
                defaultChecked={updatableitemInContext.answer5}
                label={this.state.questions.Q5}
                onText="Ja"
                offText="Nej"
                onChanged={(answer5)=>{
                    updatableitemInContext.answer5=answer5;
                    if(!answer5){
                        updatableitemInContext.answer5Description ='';
                    }
                    this.setState({answers:updatableitemInContext})
                }}
                />
                <div className={updatableitemInContext.answer5?styles.descriptionTextFieldHidden:styles.descriptionTextFieldVisible} >
                <TextField  
                        className={updatableitemInContext.answer5?styles.descriptionTextFieldHidden:styles.descriptionTextFieldVisible} 
                        label="Hvis nej så uddyb" 
                        multiline rows={4} 
                        value={updatableitemInContext.answer5Description}  
                        onChanged={(input)=>updatableitemInContext.answer5Description=input}
                        />
                    <ChoiceGroup
                        defaultSelectedKey={updatableitemInContext.answer5Remark==0?"5None":
                                                updatableitemInContext.answer5Remark==1?"5Blue":
                                                    updatableitemInContext.answer5Remark==2?"5Yellow":
                                                        updatableitemInContext.answer5Remark==3?"5Red":""}

                        options={[
                        {
                            key: '5None',
                            text: 'Ingen bemærkninger'
                            
                        } as IChoiceGroupOption,
                        {
                        key: '5Blue',
                        text: 'Blå'
                        },
                        {
                            key: '5Yellow',
                            text: 'Gul'
                        },
                        {
                            key: '5Red',
                            text: 'Rød'
                        }
                    ]}
                        onChange={this._onChange}
                        label="Angiv bemærkning"
                    />
                    
                </div>
            </div>
            {/************************************* Question 6 (Optional) *************************************/}
            {this.state.questions.Q6.length>0?
            <div className={ styles.question}>
                <Toggle
                defaultChecked={updatableitemInContext.answer6}
                label={this.state.questions.Q6}
                onText="Ja"
                offText="Nej"
                onChanged={(answer6)=>{
                    updatableitemInContext.answer6=answer6;
                    if(!answer6){
                        updatableitemInContext.answer6Description ='';
                    }
                    this.setState({answers:updatableitemInContext})
                }}
                />
                <div className={updatableitemInContext.answer6?styles.descriptionTextFieldHidden:styles.descriptionTextFieldVisible} >
                <TextField  
                        className={updatableitemInContext.answer6?styles.descriptionTextFieldHidden:styles.descriptionTextFieldVisible} 
                        label="Hvis nej så uddyb" 
                        multiline rows={4} 
                        value={updatableitemInContext.answer6Description}  
                        onChanged={(input)=>updatableitemInContext.answer6Description=input}
                        />
                    <ChoiceGroup
                        defaultSelectedKey={updatableitemInContext.answer6Remark==0?"6None":
                                                updatableitemInContext.answer6Remark==1?"6Blue":
                                                    updatableitemInContext.answer6Remark==2?"6Yellow":
                                                        updatableitemInContext.answer6Remark==3?"6Red":""}

                        options={[
                        {
                            key: '6None',
                            text: 'Ingen bemærkninger'
                            
                        } as IChoiceGroupOption,
                        {
                        key: '6Blue',
                        text: 'Blå'
                        },
                        {
                            key: '6Yellow',
                            text: 'Gul'
                        },
                        {
                            key: '6Red',
                            text: 'Rød'
                        }
                    ]}
                        onChange={this._onChange}
                        label="Angiv bemærkning"
                    />
                    
                </div>
            </div>
            :null}
            {/************************************* Concluding Question *************************************/}
            <div className={styles.question}>
                <ChoiceGroup
                    // defaultSelectedKey={updatableitemInContext.answer6==0?"None":"Blue"}
                    defaultSelectedKey={updatableitemInContext.ConcludingRemark==0?"None":
                                            updatableitemInContext.ConcludingRemark==1?"Blue":
                                                updatableitemInContext.ConcludingRemark==2?"Yellow":
                                                    updatableitemInContext.ConcludingRemark==3?"Red":""}

                    options={[
                    {
                        key: 'None',
                        text: 'Ingen bemærkninger'
                        
                    } as IChoiceGroupOption,
                    {
                    key: 'Blue',
                    text: 'Blå'
                    },
                    {
                        key: 'Yellow',
                        text: 'Gul'
                    },
                    {
                        key: 'Red',
                        text: 'Rød'
                    }
                ]}
                    onChange={this._onChange}
                    label="Angiv bemærkning"                />
            </div>
            <div >
                <DefaultButton
                className={styles.btnRow}
                        text="Gem"
                        onClick={()=>this._onBtnClick(false)}
                        />
                        <DefaultButton
                className={styles.btnRow}
                        text="Gem og Afslut"
                        onClick={()=>this._onBtnClick(true)}
                        />
            </div>
        </Panel>
                    </div>
                   

                    
            </div>
        
    );
    
    }
    
    private _onChange = (ev: React.FormEvent<HTMLInputElement>, option: any): void => {
        switch (option.key) {
            case 'None':
                updatableitemInContext.ConcludingRemark=0;        
                break;
            case 'Blue':
                updatableitemInContext.ConcludingRemark=1;        
                break;
            case 'Yellow':
                updatableitemInContext.ConcludingRemark=2;        
                break;
            case 'Green':
                updatableitemInContext.ConcludingRemark=3;        
                break;
            case '1None':
                updatableitemInContext.answer1Remark=0;        
                break;
            case '1Blue':
                updatableitemInContext.answer1Remark=1;        
                break;
            case '1Yellow':
                updatableitemInContext.answer1Remark=2;        
                break;
            case '1Green':
                updatableitemInContext.answer1Remark=3;        
                break;
            case '2None':
                updatableitemInContext.answer2Remark=0;        
                break;
            case '2Blue':
                updatableitemInContext.answer2Remark=1;        
                break;
            case '2Yellow':
                updatableitemInContext.answer2Remark=2;        
                break;
            case '2Green':
                updatableitemInContext.answer3Remark=3;        
                break;
            case '3None':
                updatableitemInContext.answer3Remark=0;        
                break;
            case '3Blue':
                updatableitemInContext.answer3Remark=1;        
                break;
            case '3Yellow':
                updatableitemInContext.answer3Remark=2;        
                break;
            case '3Green':
                updatableitemInContext.answer3Remark=3;        
                break;
            case '4None':
                updatableitemInContext.answer4Remark=0;        
                break;
            case '4Blue':
                updatableitemInContext.answer4Remark=1;        
                break;
            case '4Yellow':
                updatableitemInContext.answer4Remark=2;        
                break;
            case '4Green':
                updatableitemInContext.answer4Remark=3;        
                break;
            case '5None':
                updatableitemInContext.answer5Remark=0;        
                break;
            case '5Blue':
                updatableitemInContext.answer5Remark=1;        
                break;
            case '5Yellow':
                updatableitemInContext.answer5Remark=2;        
                break;
            case '5Green':
                updatableitemInContext.answer5Remark=3;        
                break;
            case '6None':
                updatableitemInContext.answer6Remark=0;        
                break;
            case '6Blue':
                updatableitemInContext.answer6Remark=1;        
                break;
            case '6Yellow':
                updatableitemInContext.answer6Remark=2;        
                break;
            case '6Green':
                updatableitemInContext.answer6Remark=3;        
                break;
            default:
                break;
        }
        
    };
    // private _onChangeOrg = (ev: React.FormEvent<HTMLInputElement>, option: any): void => {
    //     switch (option.key) {
    //         case 'None':
    //         updatableitemInContext.answer6Remark=0;        
    //             break;
    //         case 'Blue':
    //         updatableitemInContext.answer6Remark=1;        
    //             break;
    //         case 'Yellow':
    //         updatableitemInContext.answer6Remark=2;        
    //             break;
    //         case 'Green':
    //         updatableitemInContext.answer6Remark=3;        
    //             break;
    //         default:
    //             break;
    //     }
        
    // };
}