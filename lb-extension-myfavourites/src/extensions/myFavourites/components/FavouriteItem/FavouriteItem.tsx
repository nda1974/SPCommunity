import * as React from "react";

import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import styles from '../../myFavourites.module.scss'
import { IFavouriteItem } from "../../interfaces/IFavouriteItem";
import { Link } from 'office-ui-fabric-react/lib/Link';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
export interface IFavouriteItemProps{
    item:IFavouriteItem;
    deleteFavouriteItemCallBack:any;
    showSpinner?:boolean;
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
        this._deleteFavouriteItem=this._deleteFavouriteItem.bind(this);
    }


    public render(): React.ReactElement<IFavouriteItemProps> {
        return ( <div>
                    <div className={styles.ccitemCell} >
                            <div className={styles.ccitemCellContent }>
                                <Link href={this.props.item.ItemUrl} className={styles.ccRow}>
                                    <span>{this.props.item.Title} 
                                    {
                                    this.state.showSpinner==true?
                                    <Spinner size={SpinnerSize.xSmall} label={`Sletter favorit..`} labelPosition="left" />:
                                    null
                                    }
                                    </span>
                                </Link>
                                {
                                this.props.item.IsMandatory==false?  
                                        <Icon title="Slet" iconName={'Delete'} className={styles.iconWarningColor}  onClick={this._deleteFavouriteItem}/>
                                :null
                                }
                            </div>
                        </div>
                </div>)
                }

    private async _deleteFavouriteItem():Promise<any>{
        this.setState({showSpinner:!this.state.showSpinner});
        this.props.deleteFavouriteItemCallBack(this.props.item);
        // this.setState({showSpinner:!this.state.showSpinner});
        
    }



}