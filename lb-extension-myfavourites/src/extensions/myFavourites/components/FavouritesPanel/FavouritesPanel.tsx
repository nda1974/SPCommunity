import * as React from "react";
import { Panel, PanelType } from "office-ui-fabric-react/lib/Panel";
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import styles from '../../myFavourites.module.scss'
import { IFavouriteItem } from "../../interfaces/IFavouriteItem";

import FavouriteItem from "../FavouriteItem/FavouriteItem";
import { sp } from "@pnp/sp";

export interface IFavouritesPanelProps {
    title: string;
    showPanel: boolean;
    favourites: IFavouriteItem[];
    callbackRefreshFavourites: any;
    currentUserId: any;
}
export interface IFavouritesPanelState {
    showDialog: boolean;
    dialogTitle: string;
    status: JSX.Element;
    favouriteItems: IFavouriteItem[];
}
const CACHEID: string = "LB_FAVOURITES";
const CACHE_CURRENTUSERID: string = CACHEID + "_currentUserId";
const CACHE_CURRENTUSERFAVOURITES: string = CACHEID + "_currentUserFavourites";
const CACHE_MANDATORYFAVOURITES: string = CACHEID + "_mandatoryFavourites";

const FAVOURITES_LIST_NAME: string = "Favourites";
const MANDATORY_FAVOURITES_LIST_NAME: string = "MandatoryFavourites";
const LOG_SOURCE: string = "LB_Favoritter_ApplicationCustomizer";
export default class FavouritesPanel extends React.Component<IFavouritesPanelProps, IFavouritesPanelState>
{
    constructor(props: IFavouritesPanelProps) {
        super(props);

        this.state = {
            status: <Spinner size={SpinnerSize.large} label="Henter..." />,
            showDialog: false,
            dialogTitle: "Test",
            favouriteItems: []

        };

        this.UpdateFavouritePanel = this.UpdateFavouritePanel.bind(this);
        this._deleteFavourite=this._deleteFavourite.bind(this);

    }


    public render(): React.ReactElement<IFavouritesPanelProps> {
        return (<div>
            <Panel isOpen={this.props.showPanel}
                type={PanelType.smallFixedNear}
                className={styles.ccPanelMain} 
                isLightDismiss={true}
            >
            
            <div className={styles.ccPanelHeader} >Mine favoritter</div>
                {
                    this.props.favourites.sort((a, b) => { return Number(b.IsMandatory) - Number(a.IsMandatory) }).map((item) => {
                        return (
                            <div>
                                <FavouriteItem item={item} deleteFavouriteItemCallBack={this.UpdateFavouritePanel} showSpinner={false} />
                            </div>
                        )
                    })
                }
            </Panel>
        </div>)
    }

    public async  UpdateFavouritePanel(item: IFavouriteItem): Promise<void> {
        if (item.IsMandatory == false && item.IsDistributed ==true)  {

            // window.sessionStorage.removeItem(CACHE_MANDATORYFAVOURITES);

            const itemResponse = await sp.web.lists.getByTitle(MANDATORY_FAVOURITES_LIST_NAME).items.getById(item.Id).get();
            let unfollowersIDs: number[] = [];
            if (itemResponse.UnFollowersId) {
                itemResponse.UnFollowersId.map((unFollowers) => {
                    unfollowersIDs.push(unFollowers);
                })
                unfollowersIDs.push(this.props.currentUserId);
            }
            else{
                unfollowersIDs.push(this.props.currentUserId);
            }
            
            let list = sp.web.lists.getByTitle(MANDATORY_FAVOURITES_LIST_NAME);            
            await list.items.getById(item.Id).update({
                UnFollowersId: { results: unfollowersIDs }
            }).then(async():Promise<void>=>{
                window.sessionStorage.removeItem(CACHE_MANDATORYFAVOURITES);
                this.props.callbackRefreshFavourites();
            }    
            );
            
        } 
        else{
            if(item.IsDistributed==false) {
                
                window.sessionStorage.removeItem(CACHE_CURRENTUSERFAVOURITES);
                this._deleteFavourite(item);
            }
        }

        
        
    }

    
    public async _clearCache():Promise<void>{
        window.sessionStorage.removeItem(CACHE_MANDATORYFAVOURITES);
        await this.props.callbackRefreshFavourites();
    }

    public async _deleteFavourite(favouriteItem: IFavouriteItem): Promise<boolean> {
        
        return sp.web.lists.getByTitle(FAVOURITES_LIST_NAME).items.getById(favouriteItem.Id).delete()
        .then(async (): Promise<boolean> => {
            
            await this.props.callbackRefreshFavourites(favouriteItem);
            
            return true;
        }, (error: any): boolean => {
            return false;
        });
    }

    


}