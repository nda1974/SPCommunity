import * as React from "react";
import { IFavouriteItem } from "../../interfaces/IFavouriteItem";
import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";
export interface ITopBarProps {
    context: ApplicationCustomizerContext;
}
export interface ITopBarState {
    showPanel: boolean;
    showDialog: boolean;
    dialogTitle: string;
    status: JSX.Element;
    favourites: IFavouriteItem[];
    itemInContext: IFavouriteItem;
    audiences?: any;
    currentUser?: any;
    currentUserId?: any;
    buttonDisabled?: boolean;
}
export default class TopMenu extends React.Component<ITopBarProps, ITopBarState> {
    private _context;
    constructor(props: ITopBarProps);
    private _showPanel;
    private _getCurrentUserId;
    _getMandatoryFavouritesNew(currentUserId: any): Promise<IFavouriteItem[]>;
    private _getPersonalFavouritesNew;
    private _doGetUserFromCache;
    private _GetAllFavouritesPre;
    private filterFavourites;
    private filterFavouritesNew;
    private _showDialog;
    handleBar(itemInContext: IFavouriteItem): Promise<void>;
    handleDialogClick(createNewItem: boolean, itemInContext: IFavouriteItem): Promise<void>;
    private _hideDialog;
    private _setShowPanelState;
    render(): React.ReactElement<ITopBarProps>;
    CheckIfUserBelongsToGroup(groupName: string, userId: string): Promise<boolean>;
    CheckIfUserBelongsToGroupORG(groupName: string, userEmail: string): Promise<any>;
    saveFavourite(favouriteItem: IFavouriteItem): Promise<boolean>;
    _getMandatoryFavourites(): Promise<IFavouriteItem[]>;
    private CreateFavoriteItemObject;
    private _getUserObject;
}
