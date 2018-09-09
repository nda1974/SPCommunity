import * as React from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { IQuestionItemProps } from './IQuestionItemProps';
import { IQuestionItemState } from './IQuestionItemState';


export default class QuestionItem extends React.Component<IQuestionItemProps,IQuestionItemState> {

    constructor(props: IQuestionItemProps,state:IQuestionItemState) {
        super(props);
        this.state={
            answerToQuestion:''
        }
        this.test=this.test.bind(this);
        
    }
    public render(): React.ReactElement<IQuestionItemProps> {
        return (
        <div>
            Question: {this.props.question!=null?this.props.question.Afdeling:''}
            Answer: 
            <div>
            
            <TextField label="Standard" multiline rows={4} value={this.state.answerToQuestion}  onChanged={ e => {this.setState({answerToQuestion: e});} } />
            
            <DefaultButton
            data-automation-id="test"
            text="Button"
            onClick={this.test}
            />

            </div>
        </div>
        
    );
    
    }
    private test(event):void{
        alert(this.state.answerToQuestion);
    }   
    
       
}