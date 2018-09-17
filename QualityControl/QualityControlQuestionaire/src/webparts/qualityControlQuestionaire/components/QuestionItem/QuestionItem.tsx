import * as React from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { Dropdown, IDropdown, DropdownMenuItemType, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { IQuestionItemProps } from './IQuestionItemProps';
import { IQuestionItemState } from './IQuestionItemState';
import styles from './QuestionItem.module.scss'

export default class QuestionItem extends React.Component<IQuestionItemProps,IQuestionItemState> {

    constructor(props: IQuestionItemProps,state:IQuestionItemState) {
        super(props);
        this.state={
            answerToQuestion:true,
            answerToQuestionDescription:'',
            hideTextField:true
        }
        
        
    }
    public render(): React.ReactElement<IQuestionItemProps> {
        return (
            <div >
                <Toggle
                    defaultChecked={true}
                    label={this.props.question.ControlQuestion}
                    onText="Ja"
                    offText="Nej"
                    onChanged={(checked)=>this._setAnswerState(checked)}
                    // onChanged={(checked)=>this.setState({hideTextField:checked},this.test)}
                    
                    />
                
                <TextField  className={this.state.hideTextField?styles.descriptionTextFieldHidden:styles.descriptionTextFieldVisible} 
                            label="Hvis nej så uddyb" 
                            multiline rows={4} 
                            value={this.state.answerToQuestionDescription}  
                            // onChanged={ e => {this.setState({answerToQuestionDescription: e});} } />
                            onChanged={ (e) => this._setAnswerDescriptionState(e)} />
            </div>
        );
    }
    
    private _setAnswerState(isAnswerChecked:boolean):void{
        if (isAnswerChecked) {
            this.setState({answerToQuestionDescription:''})
        }
        this.setState({hideTextField:isAnswerChecked},
            this.props.setParentAnswerState(isAnswerChecked));
    }
    private _setAnswerDescriptionState(description:string):void{
        this.setState({answerToQuestionDescription:description},
            this.props.setParentAnswerDescriptionState(description));
    }

       
}