import * as React from "react";

import { IMyFavoutiteDisplayItemProps } from "./IMyFavoutiteDisplayItemProps";
import { IMyFavoutiteDisplayItemState } from "./IMyFavoutiteDisplayItemState";
import { DefaultButton, PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { Link } from 'office-ui-fabric-react/lib/Link';
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
import styles from "../MyFavourites.module.scss";
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import  pnp  from 'sp-pnp-js';


export default class MyFavoutiteDisplayItem extends React.Component<IMyFavoutiteDisplayItemProps, IMyFavoutiteDisplayItemState> {
    constructor(props: IMyFavoutiteDisplayItemProps) {
        super(props);
        this.state = {
            status: <span></span>,
            disableButtons: false
        };
    }

    public render(): React.ReactElement<IMyFavoutiteDisplayItemProps> {
        
        pnp.sp.web.currentUser.get().then(result=>{
            //console.log(result)
        })


        let firstLetter: string = this.props.displayItem.Title.charAt(0).toUpperCase();
        const showEditButton = this.props.displayItem.Mandatory;
        return (
                <div className={`${styles.ccitemContent}`}>
                    <Link href={this.props.displayItem.ItemUrl} className={styles.ccRow}>
                            <span className={`ms-font-l`}>{this.props.displayItem.Title}</span>
                    </Link>
                    {this.props.displayItem.Mandatory==false?
                                    <div className={styles.iconsContainer}>
                                        <Icon title="Rediger" iconName={'Edit'} className={styles.iconPrimaryColor} onClick={this._editFavourite.bind(this)}   />
                                        <Icon title="Slet" iconName={'Delete'} className={styles.iconWarningColor} onClick={this._deleteFavourite.bind(this)} />
                                            <div className={styles.ccStatus}>
                                                {this.state.status}
                                            </div>
                                    </div>
                                :null}
                    <div className={styles.ccitemDesc}>{this.props.displayItem.Description}</div>
                </div>
        );
    }

    private async _deleteFavourite(): Promise<void> {

        let status: JSX.Element = <Spinner size={SpinnerSize.small} />;
        let disableButtons: boolean = true;
        this.setState({ ...this.state, status, disableButtons });
        await this.props.deleteFavourite(this.props.displayItem.Id);
        status = <span></span>;
        disableButtons = false;
        this.setState({ ...this.state, status, disableButtons });
    }

    private _editFavourite(): void {
        let status: JSX.Element = <Spinner size={SpinnerSize.small} />;
        let disableButtons: boolean = true;
        this.setState({ ...this.state, status, disableButtons });

        this.props.editFavoutite(this.props.displayItem);

        status = <span></span>;
        disableButtons = false;
        this.setState({ ...this.state, status, disableButtons });
    }
}
