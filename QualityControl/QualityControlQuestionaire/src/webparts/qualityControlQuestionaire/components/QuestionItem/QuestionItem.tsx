import * as React from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { Dropdown, IDropdown, DropdownMenuItemType, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { IQuestionItemProps } from './IQuestionItemProps';
import { IQuestionItemState } from './IQuestionItemState';
import styles from './QuestionItem.module.scss'
import { IAnswer } from '../../Interfaces/IAnswer';

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
        const a:IAnswer={};    
        return (
            <div >
                        
                    </div>
        );
    }
    

       
}