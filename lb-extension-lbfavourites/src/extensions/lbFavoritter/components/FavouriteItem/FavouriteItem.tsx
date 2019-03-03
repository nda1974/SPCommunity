import * as React from "react";
import * as ReactDOM from "react-dom";
import pnp ,{setup, Web}from "sp-pnp-js";
import { DefaultButton, PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { Panel, PanelType } from "office-ui-fabric-react/lib/Panel";
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { List } from "office-ui-fabric-react/lib/List";
import { FocusZone, FocusZoneDirection } from 'office-ui-fabric-react/lib/FocusZone';
import styles from '../LBFavourites.module.scss'
import { IFavouriteItem } from "../../interfaces/IFavouriteItem";
import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";
import { Log } from "@microsoft/sp-core-library";
import { Link } from 'office-ui-fabric-react/lib/Link';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
export interface IFavouriteItemProps{
    item:IFavouriteItem;
    callBackUpdateFavouriteItem:any;
}
export interface IFavouriteItemState{
    showSpinner?:boolean;
}


export default class FavouriteItem extends React.Component<IFavouriteItemProps,IFavouriteItemState>
{
    constructor(props: IFavouriteItemProps) {
        super(props);

        this.state = {
            showSpinner:false
        };
        this.UpdateFavouriteItem=this.UpdateFavouriteItem.bind(this);
    }


    public render(): React.ReactElement<IFavouriteItemProps> {
        return ( <div>
                    <div className={styles.ccitemCell} >
                            <div className={styles.ccitemCellContent }>
                                <Link href={this.props.item.ItemUrl} className={styles.ccRow}>
                                    <span >{this.props.item.Title}</span>
                                    {
                                    this.state.showSpinner==true?
                                    <Spinner size={SpinnerSize.xSmall} label={`Sletter ${this.props.item.Title}`}  />:
                                    null
                                    }
                                </Link>
                                {
                                this.props.item.IsMandatory==false?  
                                        <Icon title="Slet" iconName={'Delete'} className={styles.iconWarningColor}  onClick={this.UpdateFavouriteItem}/>
                                :null
                                }

                                
                                
                            </div>
                        </div>
                </div>)
                }

    private async UpdateFavouriteItem():Promise<any>{
        //this.setState({showSpinner:!this.state.showSpinner});
        this.props.callBackUpdateFavouriteItem(this.props.item);
        // await this.props.callBackUpdateFavouriteItem(this.props.item).then(res=>{
        //     this.setState({showSpinner:!this.state.showSpinner})
        //     }
        // )
    }



}