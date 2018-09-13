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
            answerToQuestion:'',
            showTextField:false
        }
        this._toggleAnswer=this._toggleAnswer.bind(this);
        
    }
    public render(): React.ReactElement<IQuestionItemProps> {
        // if (this.props.question == null) {
        //     return;
        // }
        // const t =this.props.question.ErD_x00e6_kningstilsagnOK?this.props.question.ErD_x00e6_kningstilsagnOK:false;
        
        return (
            
            
            <div >
            
            <Toggle
                defaultChecked={false}
                label={this.props.question.ControlQuestion}
                onText="Ja"
                offText="Nej"
                onChanged={(checked)=>this._toggleAnswer(checked)}
                
                />
            
            <TextField className={this.state.showTextField?styles.descriptionTextFieldVisible:styles.descriptionTextFieldHidden} label="Hvis nej så uddyb" multiline rows={4} value={this.state.answerToQuestion}  onChanged={ e => {this.setState({answerToQuestion: e});} } />
            

            </div>
            
        
    );

    }
    
    private   _toggleAnswer(data):void{
         this.setState({showTextField:data})
    }   
    
       
}