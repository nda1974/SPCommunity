import * as React from "react";
import { IFavouriteItem } from "../../interfaces/IFavouriteItem";
export interface IFavouriteItemProps {
    item: IFavouriteItem;
    callBackUpdateFavouriteItem: any;
}
export interface IFavouriteItemState {
    showSpinner?: boolean;
}
export default class FavouriteItem extends React.Component<IFavouriteItemProps, IFavouriteItemState> {
    constructor(props: IFavouriteItemProps);
    render(): React.ReactElement<IFavouriteItemProps>;
    private UpdateFavouriteItem;
}
