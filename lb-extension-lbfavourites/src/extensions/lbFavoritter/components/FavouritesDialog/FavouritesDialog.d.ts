import * as React from "react";
import { IFavouriteItem } from "../../interfaces/IFavouriteItem";
export interface IFavouritesDialogProps {
    dialogTitle: string;
    showDialog: boolean;
    callbackHandleDialogClick: any;
    itemInContext?: IFavouriteItem;
}
export interface IFavouritesDialogState {
    showDialog: boolean;
    itemInContext?: IFavouriteItem;
    status: JSX.Element;
}
export default class FavouritesDialog extends React.Component<IFavouritesDialogProps, IFavouritesDialogState> {
    constructor(props: IFavouritesDialogProps);
    private toggleDialog;
    private _setTitle;
    render(): React.ReactElement<IFavouritesDialogProps>;
    private _hideDialog;
    private _saveMyFavourite;
    private _cancelDialog;
}
