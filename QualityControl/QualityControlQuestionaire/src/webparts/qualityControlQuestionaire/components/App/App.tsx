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


let employeeInFocus:IQCUser={
    name:'',
    email:'',
    userRole:IUserRoles.Employee
};
let priviligedUser:IQCUser={
    name:'',
    email:'',
    userRole:IUserRoles.PriviligedUser
};
let itemInContext: IAnswer = {
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

    
    constructor(props: IAppProps) {
        super(props);
        
        this.state = {

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
        
        
        this._getQuestions=this._getQuestions.bind(this);
        this._getAnswers=this._getAnswers.bind(this);
        this._onBtnClick=this._onBtnClick.bind(this);
        this.test=this.test.bind(this);
        // this.saveAnswer=this.saveAnswer.bind(this);
        this._onChange=this._onChange.bind(this);
        this._updateAnswers=this._updateAnswers.bind(this);
        // this._getPeoplePickerItems();
        this.test();
        this._getAnswers();
        

                
                
        
    }
    private async test():Promise<void>{

        const t:any = await this._getQuestions().then((t)=>{
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
            
        );
        
    }
    //https://github.com/pnp/pnpjs/issues/196#issuecomment-410908170
    public _onBtnClick():void{
        this.setState({answers:itemInContext},this._updateAnswers);



        // pnp.sp.web
        // .getFolderByServerRelativeUrl('/sites/NICD/Delte%20dokumenter')
        // .files
        // .add('test.docx', '123', true)
        // .then(f => f.file.getItem())
        // .then(item => {
        //     return item.update({
        //     Title: 'A Title'
        //     });
        // })
        // .then(console.log)
        // .catch(console.error);
        // var templateUrl:string='/sites/NICD/Delte%20dokumenter/Forms/Template/QCTemplate.dotx'
        // var templateUrl:string='/sites/Skade/Delte%20dokumenter/Forms/QC Report/QCTemplate.dotx'
        // var templateUrl:string='/sites/Skade/Dokumenter/Forms/QC Report/QCTemplate.dotx'
        // var templateUrl:string='/sites/Skade/Delte%20dokumenter/nicd.docx'
        // var name:string='QCTemplate.dotx'
        // var url:string='/sites/Skade/Delte%20dokumenter'
        
        // pnp.sp.web.getFolderByServerRelativeUrl(url).files.add('nicdTest.docx',).then(
        //     ({file})=>{
        //         return file.getItem();
        //     }
        // ).then(item=>{
        //     return item.validateUpdateListItem([{FieldName:'Title',FieldValue:'Yahoo'},{FieldName:'ContentType',FieldValue:'QC Report'}])
        // })

        // pnp.sp.web.getFileByServerRelativeUrl(templateUrl).get.getBuffer().then((templateData:ArrayBuffer)=>{
        //     console.log(templateData);
        //     pnp.sp.web.getFolderByServerRelativeUrl(url).files.add('nicdTest.docx',templateData).then(
        //         ({file})=>{
        //             return file.getItem();
        //         }
        //     ).then(item=>{
        //         return item.validateUpdateListItem([{FieldName:'Title',FieldValue:'Yahoo'}])
        //     })
        // })
        
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
    private async _getPriviligedUser(userId:number):Promise<any>{
        return pnp.sp.web.getUserById(userId).get().then(user=>{
            priviligedUser.email = user.Email;
            priviligedUser.name= user.Title;
            itemInContext.priviligedUser=priviligedUser;
            this.setState({answers:itemInContext});

        })    
    }
    private async _getEmployee(userId:number):Promise<any>{
        return pnp.sp.web.getUserById(userId).get().then(user=>{
            employeeInFocus.email = user.Email;
            employeeInFocus.name= user.Title;
            itemInContext.employeeInFocus=employeeInFocus;
            this.setState({answers:itemInContext});
        })    
    }
    public async _updateAnswers(): Promise<void> {
        // Getting the second "page" of results from the top query
        pnp.sp.web.lists.getById(ANSWERS_LIST_ID).items.getById(itemInContext.listItemId).update({
            Title: itemInContext.claimID,
            Answer1:itemInContext.answer1,
            Answer1Description:itemInContext.answer1Description,
            Answer2:itemInContext.answer2,
            Answer2Description:itemInContext.answer2Description,
            Answer3:itemInContext.answer3,
            Answer3Description:itemInContext.answer3Description,
            Answer4:itemInContext.answer4,
            Answer4Description:itemInContext.answer4Description,
            Answer5:itemInContext.answer5,
            Answer5Description:itemInContext.answer5Description,
            Answer6:itemInContext.answer6
        }).then(r => {
            
            // this result will have two properties "data" and "item"
            // data is what was returned from SharePoint after the update operation
            // and item is an object of type item representing the REST query to that item
            // so you can immediately chain off that

            console.log(r);
        });
    }
    public async _getAnswers(): Promise<void> {
        var queryParameters = new UrlQueryParameterCollection(window.location.href);
        var batchID:string='';
        var claimsID:string='';
        if (queryParameters.getValue("ClaimID")) {
            claimsID = queryParameters.getValue("ClaimID");
        }
        if (queryParameters.getValue("BatchID")) {
            batchID = queryParameters.getValue("BatchID");
        }

        // Quality Control - Claims Handler Questions
        // return await pnp.sp.web.lists.getByTitle('QualityControl-10Sagsgennemgang')
        await pnp.sp.web.lists.getById(ANSWERS_LIST_ID)
            .items
            .filter("BatchID eq '" + batchID + "' and ClaimID eq '" + claimsID +"'")
            // .filter("ClaimsNumber eq '" + claimsID +"'")
            .get()
            .then(async (data: any) => {
                itemInContext.listItemId= data[0].ID;
                itemInContext.department= data[0].Department;
                itemInContext.claimID= data[0].ClaimID;
                itemInContext.priviligedUser= data[0].PriviligedUserId;
                itemInContext.employeeInFocus=data[0].EmployeeInFocusId;
                
                // var a:any=this._setPriviligedUser(data[0].PriviligedUserId);
                // console.log(a)
                // var user = await a.then((res)=>{return res});
                // console.log(user)
                this.setState({answers:itemInContext})
                
                
                await this._getPriviligedUser(data[0].PriviligedUserId);
                await this._getEmployee(data[0].EmployeeInFocusId);
                //return data;
                // this.setState({items:data})
            }
        )
        // const r = await this._getPriviligedUser(data[0].PriviligedUserId);
    }
    // private async _getUserObject(): Promise<any> {
    //     try {
            
    //     pnp.sp.web.currentUser.get().then(result => {

    //             console.log(result);
    //         });
    //     } catch (error) {
    //         console.log(error)
    //     }

    // }
    // public async saveAnswer(): Promise<void> {
    //     // var userObject=await this._getUserObject();

    //     await pnp.sp.web.lists.getById(ANSWERS_LIST_ID).items.add({
    //         'Title': 'Test',
    //         // 'Description': favouriteItem.Description,
    //         'Answer1': this.state.answers.answer1,
    //         'Answer1Description': this.state.answers.answer1Description
    //     }).then(async (result: any): Promise<void> => {
    //         let addedItem: any = result.data;
    //         // await this._getAllFavourites();
    //         // return true;
    //     }, (error: any): void => {
    //         // return false;
    //     });

    // }
    private async _getPeoplePickerItems() {
        await pnp.sp.web.siteUsers.filter("Title eq 'Nicolai Danielsen'").get().then((result)=> {
            console.log(result)
        })
    }
    private _setRemark(choice:number):any{
        alert(choice);
    }
    public render(): React.ReactElement<IAppProps> {
        return (
        <div>
             <div className={ styles.container }>

                <div className={[styles.row, styles.header].join(' ') }>
                    Quality Control - ClaimID: <b>{this.state.answers.claimID}</b>
                </div>
                    {/* <div className={styles.row}>
                        <div className={[ styles.infoSection,styles.column].join(' ') }>
                            Udføres af:
                            </div>
                            <div className={[ styles.infoSection,styles.column].join(' ') }>
                            {this.state.answers.priviligedUser.name}
                        </div>
                    </div> */}

                    <div className={[styles.row, styles.infoSection].join(' ') }>
                        <div className={[ styles.column].join(' ') }>
                            Medarbejder i fokus:
                        </div>
                        <div className={[ styles.column].join(' ') }>
                            {this.state.answers.employeeInFocus.name}
                        </div>
                    </div>

                    <div className={[styles.row, styles.infoSection].join(' ') }>
                        <div className={[ styles.infoSection,styles.column].join(' ') }>
                            Afdeling:
                        </div>
                        <div className={[ styles.infoSection,styles.column].join(' ') }>
                            {this.state.answers.department}
                        </div>
                    </div>
                    {/* <QuestionItem questionDescription={this.state.questions.Q1} question={true} setParentAnswerState={this._setStateFromChildComponent} />     */}
                    
                    <div className={ styles.question}>
                        <Toggle
                        defaultChecked={true}
                        label={this.state.questions.Q1}
                        onText="Ja"
                        offText="Nej"
                        onChanged={(answer1)=>{
                            itemInContext.answer1=answer1;
                            if(!answer1){
                                itemInContext.answer1Description ='';
                            }
                            this.setState({answers:itemInContext})
                        }}
                        />
                    
                        <TextField  
                            className={this.state.answers.answer1?styles.descriptionTextFieldHidden:styles.descriptionTextFieldVisible} 
                            label="Hvis nej så uddyb" 
                            multiline rows={4} 
                            value={itemInContext.answer1Description}  
                            onChanged={(input)=>itemInContext.answer1Description=input}
                            />
                    </div>
                    
                    <div className={ styles.question}>
                            <Toggle
                            defaultChecked={true}
                            label={this.state.questions.Q2}
                            onText="Ja"
                            offText="Nej"
                            onChanged={(answer2)=>{
                                itemInContext.answer2=answer2;
                                if(!answer2){
                                    itemInContext.answer2Description ='';
                                }
                                this.setState({answers:itemInContext})
                            }}
                            />
                        
                            <TextField  
                                className={this.state.answers.answer2?styles.descriptionTextFieldHidden:styles.descriptionTextFieldVisible} 
                                label="Hvis nej så uddyb" 
                                multiline rows={4} 
                                value={itemInContext.answer2Description}  
                                onChanged={(input)=>itemInContext.answer2Description=input}
                                />
                    </div>

                    <div className={ styles.question}>
                            <Toggle
                            defaultChecked={true}
                            label={this.state.questions.Q3}
                            onText="Ja"
                            offText="Nej"
                            onChanged={(answer3)=>{
                                itemInContext.answer3=answer3;
                                if(!answer3){
                                    itemInContext.answer3Description ='';
                                }
                                this.setState({answers:itemInContext})
                            }}
                            />
                        
                            <TextField  
                                className={this.state.answers.answer3?styles.descriptionTextFieldHidden:styles.descriptionTextFieldVisible} 
                                label="Hvis nej så uddyb" 
                                multiline rows={4} 
                                value={itemInContext.answer3Description}  
                                onChanged={(input)=>itemInContext.answer3Description=input}
                                />
                    </div>

                    <div className={ styles.question}>
                            <Toggle
                            defaultChecked={true}
                            label={this.state.questions.Q4}
                            onText="Ja"
                            offText="Nej"
                            onChanged={(answer4)=>{
                                itemInContext.answer4=answer4;
                                if(!answer4){
                                    itemInContext.answer4Description ='';
                                }
                                this.setState({answers:itemInContext})
                            }}
                            />
                        
                            <TextField  
                                className={this.state.answers.answer4?styles.descriptionTextFieldHidden:styles.descriptionTextFieldVisible} 
                                label="Hvis nej så uddyb" 
                                multiline rows={4} 
                                value={itemInContext.answer4Description}  
                                onChanged={(input)=>itemInContext.answer4Description=input}
                                />
                    </div>
                    <div className={ styles.question}>
                            <Toggle
                            defaultChecked={true}
                            label={this.state.questions.Q5}
                            onText="Ja"
                            offText="Nej"
                            onChanged={(answer5)=>{
                                itemInContext.answer5=answer5;
                                if(!answer5){
                                    itemInContext.answer5Description ='';
                                }
                                this.setState({answers:itemInContext})
                            }}
                            />
                        
                            <TextField  
                                className={this.state.answers.answer5?styles.descriptionTextFieldHidden:styles.descriptionTextFieldVisible} 
                                label="Hvis nej så uddyb" 
                                multiline rows={4} 
                                value={itemInContext.answer5Description}  
                                onChanged={(input)=>itemInContext.answer5Description=input}
                                />
                    </div>

                    <div>
        <ChoiceGroup
          defaultSelectedKey="B"
          options={[
            {
              key: 'Blue',
              text: 'Blå',
              'data-automation-id': 'auto1'
            } as IChoiceGroupOption,
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
                   
                   
                    </div>

                    <div >
                        <DefaultButton
                                data-automation-id="test"
                                text="Gem"
                                onClick={this._onBtnClick}
                                />
                    </div>
            </div>
        
    );
    
    }
    private _onChange = (ev: React.FormEvent<HTMLInputElement>, option: any): void => {
        switch (option.key) {
            case 'Green':
            itemInContext.answer6=1;        
                break;
            case 'Blue':
            itemInContext.answer6=2;        
                break;
            case 'Yellow':
            itemInContext.answer6=2;        
                break;
            default:
                break;
        }
        this.setState({answers:itemInContext})
      };
}