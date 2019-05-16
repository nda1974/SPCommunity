import * as React from "react";
import { IFavouriteItem } from "../../interfaces/IFavouriteItem";
export interface IFavouritesPanelProps {
    title: string;
    showPanel: boolean;
    favourites: IFavouriteItem[];
    callbackRefreshFavourites: any;
    currentUser: any;
    currentUserId: any;
}
export interface IFavouritesPanelState {
    showDialog: boolean;
    dialogTitle: string;
    status: JSX.Element;
    favouriteItems: IFavouriteItem[];
}
export default class FavouritesPanel extends React.Component<IFavouritesPanelProps, IFavouritesPanelState> {
    constructor(props: IFavouritesPanelProps);
    render(): React.ReactElement<IFavouritesPanelProps>;
    UpdateFavouritePanel(item: IFavouriteItem): Promise<void>;
    _deleteFavourite(favouriteItem: IFavouriteItem): Promise<boolean>;
}
