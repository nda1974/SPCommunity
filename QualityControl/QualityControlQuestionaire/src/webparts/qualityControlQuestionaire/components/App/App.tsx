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
    listItemId:null,
    batchID:'',
    claimID:'',
    department:'',
    employeeInFocus:employeeInFocus,
    priviligedUser:priviligedUser,
    answer1:true,
    answer1Description:'',
    answer2:true,
    answer2Description:'',
    answer3:true,
    answer3Description:'',
    answer4:true,
    answer4Description:'',
    answer5:true,
    answer5Description:'',
    answer6:0
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
                batchID:'',
                claimID:'',
                department:'',
                priviligedUser:priviligedUser,
                employeeInFocus:employeeInFocus,
                listItemId:0,
                answer1:true,
                answer1Description:'',
                answer2:true,
                answer2Description:'',
                answer3:true,
                answer3Description:'',
                answer4:true,
                answer4Description:'',
                answer5:true,
                answer5Description:'',
                answer6:0
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
    public _onBtnClick():void{
        this._updateAnswers();
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
    
    
    public async _updateAnswers(): Promise<void> {
        
        pnp.sp.web.lists.getById(ANSWERS_LIST_ID).items.getById(updatableitemInContext.listItemId).update({
            Title: updatableitemInContext.claimID,
            Answer1:updatableitemInContext.answer1,
            Answer1Description:updatableitemInContext.answer1Description,
            Answer2:updatableitemInContext.answer2,
            Answer2Description:updatableitemInContext.answer2Description,
            Answer3:updatableitemInContext.answer3,
            Answer3Description:updatableitemInContext.answer3Description,
            Answer4:updatableitemInContext.answer4,
            Answer4Description:updatableitemInContext.answer4Description,
            Answer5:updatableitemInContext.answer5,
            Answer5Description:updatableitemInContext.answer5Description,
            Answer6:updatableitemInContext.answer6
        }).then(r => {
            this.setState({showPanel:!this.state.showPanel})
            console.log(r);
        });
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
            .filter("PriviligedUser eq "+ this.state.currentUser.id)
            .get()
            .then(async (data: any[]) => {
                console.log(data)
                data.map((item)=>{
                    answersitems.push(  {
                                            claimID:item.ClaimID,
                                            listItemId:item.Id,
                                            employeeInFocus:{
                                                name:'Fisk',
                                                email:''
                                            },
                                            answer1:item.Answer1,
                                            answer1Description:item.Answer1Description,
                                            answer2:item.Answer2,
                                            answer2Description:item.Answer2Description,
                                            answer3:item.Answer3,
                                            answer3Description:item.Answer3Description,
                                            answer4:item.Answer4,
                                            answer4Description:item.Answer4Description,
                                            answer5:item.Answer5,
                                            answer5Description:item.Answer5Description

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
                        this.setState({itemInContext:answer},()=>{updatableitemInContext = this.state.itemInContext;this.setState({showPanel:!this.state.showPanel});})
                        :null
        })
        
    }
    private _onDismissPanel():void{
        
        this.setState({ showPanel: false },
        this._getAnswers)
    }
    private async _getEmployeeInFocusProps(email:string):Promise<any>{
        
        pnp.sp.web.siteUsers.getByEmail(email).get().then(res=>{
            return res
        }

        );
    }
    public render(): React.ReactElement<IAppProps> {
        return (
        <div>
            
             <div className={ styles.container }>
                {this.state.answersList.map((ans)=>{
                    return(<div className={styles.claimControlRow} 
                                onClick={()=>{
                                                this._setItemInContext(ans.listItemId);
                                            }}>
                                                            {ans.claimID} - {ans.listItemId}
                            </div>)
                })}
                
                    {/* <div className={styles.row}>
                        <div className={[ styles.infoSection,styles.column].join(' ') }>
                            Udføres af:
                            </div>
                            <div className={[ styles.infoSection,styles.column].join(' ') }>
                            {this.state.answers.priviligedUser.name}
                        </div>
                    </div> */}
    <Panel
          isOpen={this.state.showPanel}
          // tslint:disable-next-line:jsx-no-lambda
          onDismiss={() => this._onDismissPanel()}
          
          type={PanelType.extraLarge}
        //   headerText={"Quality Control - ClaimID: " + updatableitemInContext.claimID}
          closeButtonAriaLabel="Close"
        >           
        {
            this._getEmployeeInFocusProps (updatableitemInContext.employeeInFocus.email)
        }   
            <div className={[styles.row, styles.header].join(' ') }>
            <div>Quality Control - ClaimID: <b>{updatableitemInContext.claimID}</b></div>
            <div>Medarbejder i fokus: </div>
                
            </div> 
            
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
                    }
                    this.setState({answers:updatableitemInContext})
                }}
                />
            
                <TextField  
                    className={updatableitemInContext.answer1?styles.descriptionTextFieldHidden:styles.descriptionTextFieldVisible} 
                    label="Hvis nej så uddyb" 
                    multiline rows={4} 
                    value={updatableitemInContext.answer1Description}  
                    onChanged={(input)=>updatableitemInContext.answer1Description=input}
                    />
            </div>

            
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
                        }
                        this.setState({answers:updatableitemInContext})
                    }}
                    />
                
                    <TextField  
                        className={updatableitemInContext.answer2?styles.descriptionTextFieldHidden:styles.descriptionTextFieldVisible} 
                        label="Hvis nej så uddyb" 
                        multiline rows={4} 
                        value={updatableitemInContext.answer2Description}  
                        onChanged={(input)=>updatableitemInContext.answer2Description=input}
                        />
            </div>

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
                
                    <TextField  
                        className={updatableitemInContext.answer3?styles.descriptionTextFieldHidden:styles.descriptionTextFieldVisible} 
                        label="Hvis nej så uddyb" 
                        multiline rows={4} 
                        value={updatableitemInContext.answer3Description}  
                        onChanged={(input)=>updatableitemInContext.answer3Description=input}
                        />
            </div>

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
                
                    <TextField  
                        className={updatableitemInContext.answer4?styles.descriptionTextFieldHidden:styles.descriptionTextFieldVisible} 
                        label="Hvis nej så uddyb" 
                        multiline rows={4} 
                        value={updatableitemInContext.answer4Description}  
                        onChanged={(input)=>updatableitemInContext.answer4Description=input}
                        />
            </div>
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
                
                    <TextField  
                        className={updatableitemInContext.answer5?styles.descriptionTextFieldHidden:styles.descriptionTextFieldVisible} 
                        label="Hvis nej så uddyb" 
                        multiline rows={4} 
                        value={updatableitemInContext.answer5Description}  
                        onChanged={(input)=>updatableitemInContext.answer5Description=input}
                        />
            </div>

            <div>
                <ChoiceGroup
                    defaultSelectedKey="B"
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
                        key: 'Green',
                        text: 'Grøn'
                    }
                ]}
                    onChange={this._onChange}
                    
                    label={this.state.questions.Q6}
                />
            </div>
            <div>
                <DefaultButton
                        data-automation-id="test"
                        text="Gem"
                        onClick={this._onBtnClick}
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
            updatableitemInContext.answer6=0;        
                break;
            case 'Blue':
            updatableitemInContext.answer6=1;        
                break;
            case 'Yellow':
            updatableitemInContext.answer6=2;        
                break;
            case 'Green':
            updatableitemInContext.answer6=3;        
                break;
            default:
                break;
        }
        
    };
}