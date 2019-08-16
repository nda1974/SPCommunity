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
                this.setState({listItems:x.Row})
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
                    {/* {this.props.targetListId === 'b0f4b1b4-f023-458b-a1a0-a9cf815daf4b'?
                        <DanskeSelskaber    targetSiteUrl={this.props.targetSiteUrl} 
                                            targetListId={this.props.targetListId}
                                            listItems={this.state.listItems} 
                                            description='DanskeSelskaber'></DanskeSelskaber>
                        :null
                    } */}

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
  