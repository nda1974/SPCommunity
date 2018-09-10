import * as React from 'react';
import styles from '././QualityControlQuestionaire.module.scss';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';

import { IAppProps } from './IAppProps';
import { escape } from '@microsoft/sp-lodash-subset';
import pnp, { setup} from "sp-pnp-js";
import { IAppState } from './IAppState';
import QuestionItem from '../QuestionItem/QuestionItem';
export default class App extends React.Component<IAppProps, IAppState> {


    constructor(props: IAppProps) {
        super(props);
        this.state = {
            items:[]=[]
        }

        setup({
            sp: {
                headers: {
                    Accept: "application/json;"
                },
                baseUrl: "https://lbforsikring.sharepoint.com/sites/skade"
            },
            
        });
        
        
        this._getQuestionaires=this._getQuestionaires.bind(this);
        this.test=this.test.bind(this);
        // this.test();
                
                
        
    }
    private async test():Promise<void>{
        const t:any = await this._getQuestionaires
        const tt:any = await t;
        console.log(t)
        console.log(tt)
        //this.setState({items:tt})
    }
    public async _getQuestionaires(): Promise<any> {
        return await pnp.sp.web.lists.getByTitle('QualityControl-10Sagsgennemgang')
            .items
            .filter("Title eq '1'")
            .get()
            .then((data: any) => {
                console.log(data)
                return data;
                // this.setState({items:data})
            }
        )
    }

    public render(): React.ReactElement<IAppProps> {
        this.test;
        return (
        <div className={ styles.qualityControlQuestionaire }>
            <QuestionItem description='asdf' question={this.state.items.length>0?this.state.items[0]:null}/>
        </div>
    );
    
    }
}