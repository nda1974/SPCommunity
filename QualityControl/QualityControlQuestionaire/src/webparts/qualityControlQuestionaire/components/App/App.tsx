import * as React from 'react';
import styles from '././QualityControlQuestionaire.module.scss';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Image, IImageProps, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
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
        this.test();
                
                
        
    }
    private async test():Promise<void>{
        const t:any = await this._getQuestionaires();
        const tt:any = await t;
        console.log(t)
        console.log(tt)
        this.setState({items:tt})
    }
    public async _getQuestionaires(): Promise<any> {
        // Quality Control - Claims Handler Questions
        // return await pnp.sp.web.lists.getByTitle('QualityControl-10Sagsgennemgang')
        return await pnp.sp.web.lists.getById('ad5ea1c8-3321-4a16-bc06-39a3b03d9e20')
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

    public render(): React.ReactElement<IAppProps> {
        return (
        <div className={ styles.qualityControlQuestionaire }>
             <div className={ styles.container }>
                <div className={ styles.row }>
                    Afdeling: 
                </div>

                <div className={ styles.row }>
                    Udføres af: 
                </div>

                <div className={ styles.row }>
                    Medarbejder i fokus:
                </div>

                <div className={ styles.row }>
                    Skadenummer:
                </div>

                {this.state.items.map((item)=>{
                    return <QuestionItem description='asdf' question={item} />
                })}

                <div>
                    
                </div>

                <div className={ styles.row }>
                    <DefaultButton
                data-automation-id="test"
                text="Gem"
                // onClick={this.test}
                />
                </div>

                
            </div>
        </div>
    );
    
    }
}