import * as React from "react";
import { DefaultButton, PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import styles from '../../myFavourites.module.scss'
import { IFavouriteItem } from "../../interfaces/IFavouriteItem";
export interface IFavouritesDialogProps{
    dialogTitle:string;
    showDialog:boolean;
    callbackHandleDialogClick:any;
    itemInContext?:IFavouriteItem;
}
export interface IFavouritesDialogState{
    showDialog:boolean;
    itemInContext?:IFavouriteItem;
    status: JSX.Element;
}

const FAVOURITES_LIST_NAME: string = "Favourites";
const MANDATORY_FAVOURITES_LIST_NAME: string = "MandatoryFavourites";
const LOG_SOURCE: string = "LB_Favoritter_ApplicationCustomizer";

export default class FavouritesDialog extends React.Component<IFavouritesDialogProps,IFavouritesDialogState>
{
    constructor(props: IFavouritesDialogProps) {
        super(props);

        this.state = {
            status: <span></span>,
            showDialog:false,
            itemInContext: {
                Id: 0,
                Title: "",
                IsDistributed:false,
                IsMandatory:false,
                IsPersonal:true,
                ItemUrl:window.location.href,
                LBAudience:null
            }
        };
        this.toggleDialog=this.toggleDialog.bind(this);

    }

private async toggleDialog(createNewItem:boolean):Promise<void>{
    
    try {
        await this.props.callbackHandleDialogClick(createNewItem,this.state.itemInContext);    
        
        let itemInContext:IFavouriteItem ={
            Id: 0,
            Title: "",
            IsDistributed:false,
            IsMandatory:false,
            IsPersonal:true,
            ItemUrl:null,
            LBAudience:null
        };
        this.setState({ ...this.state, itemInContext});
        
    } catch (error) {
        let status = <span>Der opstod en fejl</span>;
        this.setState({status:status});    
    }
}

private _setTitle(value: string): void {
    let itemInContext: IFavouriteItem = this.state.itemInContext;
    itemInContext.Title = value;
    this.setState({ ...this.state, itemInContext });
}

    public render(): React.ReactElement<IFavouritesDialogProps> {
        return ( <div>
                    <Dialog
                                hidden={!this.props.showDialog}
                                dialogContentProps={{
                                    type: DialogType.largeHeader,
                                    title: this.props.dialogTitle
                                }}
                                modalProps={{
                                    titleAriaId: "myFavDialog",
                                    subtitleAriaId: "myFavDialog",
                                    isBlocking: false
                                }}
                            >
                                <div>
                                    {this.state.status}
                                </div>
                                <TextField label="Navn"
                                           onChanged={this._setTitle.bind(this)}
                                           value={this.state.itemInContext.Title}
                                            />
                               
                                <DialogFooter>
                                    <PrimaryButton 
                                                    onClick={this._saveMyFavourite.bind(this)}
                                                    text="Gem" iconProps={{ iconName: "Save" }}
                                                    className={styles.ccDialogButton}/>
                                    <DefaultButton 
                                                    onClick={this._cancelDialog.bind(this)}
                                                    text="Luk"
                                                    iconProps={{ iconName: "Cancel" }} />
                                </DialogFooter>
                            </Dialog>



                </div>)
                }

    private _hideDialog(): void {
        this.setState({ showDialog: false });
    }
    
    private _saveMyFavourite(): void {
        this.toggleDialog(true);
    }
    private _cancelDialog(): void {
        let itemInContext:IFavouriteItem ={
            Id: 0,
            Title: "",
            IsDistributed:false,
            IsMandatory:false,
            IsPersonal:true,
            ItemUrl:null,
            LBAudience:null
        };
        this.setState({ ...this.state, itemInContext});
        this.toggleDialog(false);
    }
    



}