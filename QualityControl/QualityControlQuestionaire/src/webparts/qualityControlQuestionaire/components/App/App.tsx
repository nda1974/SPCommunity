import * as React from 'react';
import styles from '././QualityControlQuestionaire.module.scss';
import { IAppProps } from './IAppProps';
import { escape } from '@microsoft/sp-lodash-subset';
import pnp, { setup, Web, ItemAddResult } from "sp-pnp-js";
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
        
        
        this._getQuestionaires()
        
    }
    public async _getQuestionaires(): Promise<void> {
        let returnItems: any[] = [];

        const itemsResponse= await pnp.sp.web.lists.getByTitle('QualityControl-10Sagsgennemgang')
            .items
            .filter("Title eq '1'")
            .get()
            .then((data: any) => {
                console.log(data)
                // const itemsData: any[] = await data;
                this.setState({items:data})
            }

            )
            
    }
    public render(): React.ReactElement<IAppProps> {
        return (
        <div className={ styles.qualityControlQuestionaire }>
        <div className={ styles.container }>
            <div className={ styles.row }>
            <QuestionItem description='asdf' question={this.state.items.length>0?this.state.items[0]:null}/>
            </div>
        </div>
        </div>
    );
    
    }
}