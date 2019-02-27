import * as React from "react";
import * as ReactDOM from "react-dom";
import pnp, { setup, Web, ItemUpdateResult } from "sp-pnp-js";
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
import FavouriteItem from "../FavouriteItem/FavouriteItem";
export interface IFavouritesPanelProps {
    // context: ApplicationCustomizerContext;
    title: string;
    showPanel: boolean;
    favourites: IFavouriteItem[];
    callbackRefreshFavourites: any;
    currentUser: any;
}
export interface IFavouritesPanelState {

    showDialog: boolean;
    dialogTitle: string;
    status: JSX.Element;
    favouriteItems: IFavouriteItem[];
}

const FAVOURITES_LIST_NAME: string = "Favourites";
const MANDATORY_FAVOURITES_LIST_NAME: string = "MandatoryFavourites";
const LOG_SOURCE: string = "LB_Favoritter_ApplicationCustomizer";
export default class FavouritesPanel extends React.Component<IFavouritesPanelProps, IFavouritesPanelState>
{
    constructor(props: IFavouritesPanelProps) {
        super(props);

        this.state = {
            status: <Spinner size={SpinnerSize.large} label="Henter..." />,
            // showPanel: false,
            showDialog: false,
            dialogTitle: "Test",
            favouriteItems: []

        };

        // this.UpdateFavouritePanel=this.UpdateFavouritePanel.bind(this);
        this.UpdateFavouritePanel = this.UpdateFavouritePanel.bind(this);
        this._deleteFavourite=this._deleteFavourite.bind(this);

    }


    public render(): React.ReactElement<IFavouritesPanelProps> {
        return (<div>
            <Panel isOpen={this.props.showPanel}
                type={PanelType.smallFixedNear}
                // headerText="Mine favoritter"
                className={styles.ccPanelMain} 
                isLightDismiss={true}
            >
            
            <div className={styles.ccPanelHeader} >Mine favoritter</div>
                {
                    this.props.favourites.sort((a, b) => { return Number(b.IsMandatory) - Number(a.IsMandatory) }).map((item) => {
                        return (
                            <div>
                                {/* <FavouriteItem item={item} callBackUpdateFavouriteItem={this.UpdateFavouritePanel} /> */}
                                <FavouriteItem item={item} callBackUpdateFavouriteItem={this.UpdateFavouritePanel} />
                            </div>
                        )
                    })
                }
            </Panel>
        </div>)
    }

    public async  UpdateFavouritePanel(item: IFavouriteItem): Promise<void> {
        if (item.IsMandatory == false && item.IsDistributed ==true)  {
            const itemResponse = await pnp.sp.web.lists.getByTitle(MANDATORY_FAVOURITES_LIST_NAME).items.getById(item.Id).get();
            let unfollowersIDs: number[] = [];
            if (itemResponse.UnFollowersId) {
                itemResponse.UnFollowersId.map((unFollowers) => {
                    unfollowersIDs.push(unFollowers);
                })
                unfollowersIDs.push(this.props.currentUser.Id);
            }
            else{
                unfollowersIDs.push(this.props.currentUser.Id);
            }
            let list = pnp.sp.web.lists.getByTitle(MANDATORY_FAVOURITES_LIST_NAME);

            list.items.getById(item.Id).update({
                UnFollowersId: { results: unfollowersIDs }
            }).then(
                await this.props.callbackRefreshFavourites()
            );
        } 
        else{
            if(item.IsDistributed==false) {
                this._deleteFavourite(item);
            }
        }
    }

    // public async UpdateFavouritePanel(favouriteItem: IFavouriteItem):Promise<void>{
    //     if (favouriteItem.IsMandatory==false) {
    //         const item= await pnp.sp.web.lists.getByTitle(MANDATORY_FAVOURITES_LIST_NAME).items.getById(favouriteItem.Id);
    //         const itemData=await item;
    //         let userIDs:number[]=[];
    //         if(itemData)
    //         {

    //         }
    //         // await this._updateFavourite(favouriteItem)
    //     } else {
    //         // await this._deleteFavourite(favouriteItem);    
    //     }

    //     // await this.props.callbackRefreshFavourites(favouriteItem);
    // }

    public async _deleteFavourite(favouriteItem: IFavouriteItem): Promise<boolean> {
        return pnp.sp.web.lists.getByTitle(FAVOURITES_LIST_NAME).items.getById(favouriteItem.Id).delete()
        .then(async (): Promise<boolean> => {
            await this.props.callbackRefreshFavourites(favouriteItem);
            return true;
        }, (error: any): boolean => {
            return false;
        });
    }

    // public async _updateFavourite(favouriteItem: IFavouriteItem): Promise<boolean> {
    //     return pnp.sp.web.lists.getByTitle(FAVOURITES_LIST_NAME).items.getById(favouriteItem.Id).update({
    //         'Title': favouriteItem.Title
    //     }).then(async (result: ItemUpdateResult): Promise<boolean> => { 
    //         // console.log(result);
    //         return true;
    //     }, (error: any): boolean => {
    //         return false;
    //     });
    // }


    // private _editFavourite(): void {
    //     let status: JSX.Element = <Spinner size={SpinnerSize.small} />;
    //     let disableButtons: boolean = true;
    //     this.setState({ ...this.state, status });

    //     // this.props.editFavourite(this.props.displayItem);

    //     status = <span></span>;

    //     this.setState({ ...this.state, status });
    // }



}