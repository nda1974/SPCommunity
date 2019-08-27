import * as React from 'react';
import { escape } from '@microsoft/sp-lodash-subset';
import { IAppProps } from './IAppProps';
import { IAppState } from "./IAppState";
import SPService from "../../services/SPService"
import DanskeSelskaber from '../../viewTemplates/DanskeSelskaber/defaultView/DefaultTemplate'
import MedlemsGrupper from '../../viewTemplates/MedlemsGrupper/defaultView/DefaultTemplate'
export default class App extends React.Component<IAppProps, IAppState> {
    public constructor(props:IAppProps,state:IAppState){  
        super(props);
    
        this.state= {
                        description:'',
                        listItems:[]
                    }

        let spService: SPService=new SPService(
            {
                description:'',
                targetListID:this.props.targetListId,
                targetSiteUrl:this.props.targetSiteUrl
            }
        );
        
        if(this.props.standardSearchEnabled===true)
        {
            const res = spService.getListItemsByListID().then(x=>{
                this.setState({listItems:x})
            })
        }
        else{
            
            const res = spService.getListItemsAsStream().then(x=>{
                this.setState({listItems:x})
            })
        }

       
    }
    public render(): React.ReactElement<IAppProps> {
    
        return (
                
                <div>
                    {this.props.targetListId === '4fde6480-382b-435d-b6e9-e2a46d26c608'?
                        <DanskeSelskaber    targetSiteUrl={this.props.targetSiteUrl} 
                                            targetListId={this.props.targetListId}
                                            listItems={this.state.listItems} 
                                            description='DanskeSelskaber'></DanskeSelskaber>
                        :null
                    }

                    {this.props.targetListId === '184b5667-fe5d-4966-8506-44b5b261da91'?
                        <MedlemsGrupper 
                                            targetSiteUrl={this.props.targetSiteUrl} 
                                            targetListId={this.props.targetListId} 
                                            listItems={this.state.listItems} 
                                            medlemsGruppe={this.props.medlemsGruppe}
                                            description='MedlemsGrupper'></MedlemsGrupper>:null
                    }
                </div>
                )
    }
}
  