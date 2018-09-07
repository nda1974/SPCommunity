import * as React from 'react';
import styles from '././QualityControlQuestionaire.module.scss';
import { IAppProps } from './IAppProps';
import { escape } from '@microsoft/sp-lodash-subset';
import pnp, { setup, Web, ItemAddResult } from "sp-pnp-js";
export default class App extends React.Component<IAppProps, {}> {


    constructor(props: IAppProps) {
        super(props);
        
        setup({
            sp: {
                headers: {
                    Accept: "application/json;"
                },
                baseUrl: "https://lbforsikring.sharepoint.com/sites/skade"
            },
            
        });
        this._getQuestionaires();
    }
    public async _getQuestionaires(): Promise<void[]> {
        let returnItems: any[] = [];

        return await pnp.sp.web.lists.getByTitle('QualityControl-10Sagsgennemgang')
            .items
            .get()
            .then((data: any[]) => {
                console.log(data)
                return data;  
            }

            )
    }
    public render(): React.ReactElement<IAppProps> {
    return (
        <div className={ styles.qualityControlQuestionaire }>
        <div className={ styles.container }>
            <div className={ styles.row }>
            <div className={ styles.column }>
                <span className={ styles.title }>Welcome to SharePoint!</span>
                <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
                <p className={ styles.description }>{escape(this.props.description)}</p>
                <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
                </a>
            </div>
            </div>
        </div>
        </div>
    );
    }
}