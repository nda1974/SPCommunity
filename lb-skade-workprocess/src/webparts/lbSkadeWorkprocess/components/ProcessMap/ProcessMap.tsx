import * as React from "react";
import * as ReactDom from 'react-dom';

import { PrimaryButton, DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { IRefinementValue, IRefinementResult } from "../../ISearchResults";
import { Session, ITermStore, ITermSet, ITerms, ITermData, ITerm } from "@pnp/sp-taxonomy";
import { SPFetchClient } from "@pnp/nodejs";
import styles from './ProcessMap.module.scss'
import globalStyles from '../App/App.module.scss'
import ProcessMapButton from "./ProcessMapButton/ProcessMapButton";
// ############# PROPS #############
export interface IProcessMapProps{
    mapItems:IRefinementResult;
    setAreaFilter:any;
    
}
// ############# STATE #############
export interface IProcessMapState{
    test:(ITermData & ITerm)[];
    isSelected:boolean;
    selectedArea:string;
    
}

export default class ProcessMap extends React.Component<IProcessMapProps, IProcessMapState>{
    private queryText:string;
    // ############# CONSTRUCTOR #############
    public constructor(props:IProcessMapProps,state:IProcessMapState){  
            super(props);  
        this.state = {
            test:[],
            isSelected:false,
            selectedArea:""
            };  
        
        let term:Promise<(ITermData & ITerm)[]>=this.GetTerms();
        term.then(
            (data:(ITermData & ITerm)[])=>{
                this.setState({test:data})
                data.map((item)=>{
                    console.log(item)

                })
                
            }
        )
        this.setAreaFilter=this.setAreaFilter.bind(this)
        
    }

    public render(): React.ReactElement<IProcessMapProps> {  
        return(
            // <div className={globalStyles.row}>
            <div className={styles.container}>
            {
                this.state.test.map((item)=>{
                    return(    
                        <div className={styles.column}>
                            <ProcessMapButton isSelected={this.state.selectedArea==item.Name?true:false} setAreaFilter={(areaName) => this.setAreaFilter(areaName) } areaFilter={item.Name} />
                        </div>
                    )
                })
            }
                <div className={styles.column}>
                    <ProcessMapButton isSelected={this.state.selectedArea=="Alle"?true:false} setAreaFilter={(areaName) => this.setAreaFilter(areaName) } areaFilter={"Alle"} />
                </div>
            </div>
            
        );
    }
    private setAreaFilter(areaName):void {
        this.setState({selectedArea:areaName})
        this.props.setAreaFilter(areaName)
    }
    
    public async GetTerms():Promise<(ITermData & ITerm)[]>{
        // public async GetTerms():Promise<ITermStore>{
            const taxonomy = new Session("https://lbforsikring.sharepoint.com");

            const store: ITermStore = taxonomy.termStores.getByName("Taxonomy_x0s3QahMoxSTjrZA1/rUwg==");

            const set: ITermSet = store.getTermSetById("b36bc428-b932-4a65-aafa-0c3485c64d4e");
            
            const terms: ITerms = set.terms;
            
            // load the data into the terms instances
            const termsWithData:Promise<(ITermData & ITerm)[]> = set.terms.get();
            // termsWithData.then((data:(ITermData & ITerm)[])=>{
            //     console.log(data)
            // })
            


        return termsWithData;
        //  let t = await taxonomy.termStores.getByName("Taxonomy_x0s3QahMoxSTjrZA1/rUwg==");
        //  return t;
            
    }
    
    
    
}


