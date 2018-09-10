import * as React from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { IQuestionItemProps } from './IQuestionItemProps';
import { IQuestionItemState } from './IQuestionItemState';
import styles from '../QualityControlQuestionaire.module.scss'

export default class QuestionItem extends React.Component<IQuestionItemProps,IQuestionItemState> {

    constructor(props: IQuestionItemProps,state:IQuestionItemState) {
        super(props);
        this.state={
            answerToQuestion:''
        }
        this.test=this.test.bind(this);
        
    }
    public render(): React.ReactElement<IQuestionItemProps> {
        // if (this.props.question == null) {
        //     return;
        // }
        // const t =this.props.question.ErD_x00e6_kningstilsagnOK?this.props.question.ErD_x00e6_kningstilsagnOK:false;
        return (
            <div className={ styles.container }>
            
            <div className={ styles.row }>
            {/* Question: {this.props.question!=null?this.props.question.Afdeling:''} */}
            Er dækningstilsagn ok?
            

            <Toggle
                defaultChecked={false}
                label="Enabled and checked"
                onText="On"
                offText="Off"
                onFocus={() => console.log('onFocus called')}
                onBlur={() => console.log('onBlur called')}
                />
            <TextField label="Standard" multiline rows={4} value={this.state.answerToQuestion}  onChanged={ e => {this.setState({answerToQuestion: e});} } />
            

            </div>
            <DefaultButton
                data-automation-id="test"
                text="Button"
                onClick={this.test}
                />
        </div>
    );

    }
    private test(event):void{
        alert(this.state.answerToQuestion);
    }   
    
       
}