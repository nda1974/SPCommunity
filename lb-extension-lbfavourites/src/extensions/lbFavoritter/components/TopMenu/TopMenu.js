"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var sp_pnp_js_1 = require("sp-pnp-js");
var Button_1 = require("office-ui-fabric-react/lib/Button");
var Spinner_1 = require("office-ui-fabric-react/lib/Spinner");
var LBFavourites_module_scss_1 = require("../LBFavourites.module.scss");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var FavouritesPanel_1 = require("../Panel/FavouritesPanel");
var FavouritesDialog_1 = require("../FavouritesDialog/FavouritesDialog");
var CACHEID = "LB_FAVOURITES";
var CACHE_CURRENTUSERID = CACHEID + "_currentUserId";
var CACHE_CURRENTUSERFAVOURITES = CACHEID + "_currentUserFavourites";
var CACHE_MANDATORYFAVOURITES = CACHEID + "_mandatoryFavourites";
var FAVOURITES_LIST_NAME = "Favourites";
var MANDATORY_FAVOURITES_LIST_NAME = "MandatoryFavourites";
var LOG_SOURCE = "LB_Favoritter_ApplicationCustomizer";
var TopMenu = /** @class */ (function (_super) {
    __extends(TopMenu, _super);
    function TopMenu(props) {
        var _this = _super.call(this, props) || this;
        _this._context = _this.props.context;
        _this.state = {
            status: React.createElement(Spinner_1.Spinner, { size: Spinner_1.SpinnerSize.large, label: "Henter..." }),
            showPanel: false,
            showDialog: false,
            dialogTitle: "Test",
            favourites: [],
            itemInContext: {
                Id: 0,
                Title: "",
                IsDistributed: false,
                IsMandatory: false,
                IsPersonal: false,
                ItemUrl: window.location.href,
                LBAudience: null
            },
            currentUser: null,
            audiences: null,
            buttonDisabled: true
            // isEdit: false,
            // status: <Spinner size={SpinnerSize.large} label="Henter..." />,
            // disableButtons: false
        };
        _this.handleDialogClick = _this.handleDialogClick.bind(_this);
        _this.handleBar = _this.handleBar.bind(_this);
        // this._getFisk = this._getFisk.bind(this);
        _this._doGetUserFromCache = _this._doGetUserFromCache.bind(_this);
        _this._GetAllFavouritesPre = _this._GetAllFavouritesPre.bind(_this);
        _this._getPersonalFavouritesNew = _this._getPersonalFavouritesNew.bind(_this);
        // this._getMyFavourites.bind(this);
        sp_pnp_js_1.setup({
            sp: {
                headers: {
                    Accept: "application/json;"
                },
                baseUrl: "https://lbforsikring.sharepoint.com/sites/intra"
            },
        });
        _this._GetAllFavouritesPre();
        return _this;
    }
    // componentDidMount() {
    //     // add event listener to save state to sessionStorage
    //     // when user leaves/refreshes the page
    //     window.addEventListener(
    //       "storage",
    //       this.saveStateTosessionStorage.bind(this)
    //     );
    // }
    // private saveStateTosessionStorage(){
    //     console.log('Cache changed');
    // }
    TopMenu.prototype._showPanel = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // const favourites = await resList;
                this.setState({ showPanel: true });
                return [2 /*return*/];
            });
        });
    };
    // Ny Cache funktion
    TopMenu.prototype._getCurrentUserId = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sp_pnp_js_1.default.sp.web.currentUser.get()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TopMenu.prototype._getMandatoryFavouritesNew = function (currentUserId) {
        return __awaiter(this, void 0, void 0, function () {
            var returnItems;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        returnItems = [];
                        return [4 /*yield*/, sp_pnp_js_1.default.sp.web.lists.getByTitle(MANDATORY_FAVOURITES_LIST_NAME)
                                .items
                                .select("Id", "Title", "ItemUrl", "Description", "Mandatory", "Grupper/Title")
                                .expand("Grupper")
                                .filter("UnFollowers ne " + currentUserId)
                                .get()
                                .then(function (myFavourites) {
                                myFavourites.map(function (favourite) {
                                    var fItem = _this.CreateFavoriteItemObject(favourite, false);
                                    returnItems.push(fItem);
                                });
                                return returnItems;
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TopMenu.prototype._getPersonalFavouritesNew = function (_currrentUserID) {
        return __awaiter(this, void 0, void 0, function () {
            var returnItems;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        returnItems = [];
                        return [4 /*yield*/, sp_pnp_js_1.default.sp.web.lists.getByTitle(FAVOURITES_LIST_NAME)
                                .items
                                .select("Id", "Title", "ItemUrl", "Mandatory")
                                .filter("Author eq " + _currrentUserID)
                                .get()
                                .then(function (myFavourites) {
                                myFavourites.map(function (item) {
                                    var fItem = _this.CreateFavoriteItemObject(item, true);
                                    returnItems.push(fItem);
                                });
                                return returnItems;
                            })
                                .catch(function (error) {
                                sp_core_library_1.Log.error(LOG_SOURCE, error);
                                return [];
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TopMenu.prototype._doGetUserFromCache = function () {
        if (window.sessionStorage[CACHE_CURRENTUSERID] == undefined) {
            return false;
        }
        else {
            if (window.sessionStorage[CACHE_CURRENTUSERID].length < 1) {
                return false;
            }
        }
        return true;
    };
    TopMenu.prototype._GetAllFavouritesPre = function () {
        return __awaiter(this, void 0, void 0, function () {
            var showPanel, _currentUserID, rest, myFavouriteItems, LBFavouriteItems, favourites, buttonDisabled;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!sessionStorage.getItem(CACHE_CURRENTUSERID)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._getCurrentUserId().then((function (data) { return data; }))];
                    case 1:
                        rest = _a.sent();
                        _currentUserID = rest['Id'];
                        window.sessionStorage.setItem(CACHE_CURRENTUSERID, _currentUserID);
                        return [3 /*break*/, 3];
                    case 2:
                        _currentUserID = window.sessionStorage.getItem(CACHE_CURRENTUSERID);
                        _a.label = 3;
                    case 3:
                        if (!!window.sessionStorage[CACHE_CURRENTUSERFAVOURITES]) return [3 /*break*/, 5];
                        return [4 /*yield*/, this._getPersonalFavouritesNew(_currentUserID)];
                    case 4:
                        myFavouriteItems = _a.sent();
                        window.sessionStorage.setItem(CACHE_CURRENTUSERFAVOURITES, JSON.stringify(myFavouriteItems));
                        return [3 /*break*/, 6];
                    case 5:
                        myFavouriteItems = JSON.parse(window.sessionStorage.getItem(CACHE_CURRENTUSERFAVOURITES));
                        _a.label = 6;
                    case 6:
                        if (!!window.sessionStorage[CACHE_MANDATORYFAVOURITES]) return [3 /*break*/, 8];
                        return [4 /*yield*/, this._getMandatoryFavouritesNew(_currentUserID)];
                    case 7:
                        LBFavouriteItems = _a.sent();
                        window.sessionStorage.setItem(CACHE_MANDATORYFAVOURITES, JSON.stringify(LBFavouriteItems));
                        return [3 /*break*/, 9];
                    case 8:
                        LBFavouriteItems = JSON.parse(window.sessionStorage.getItem(CACHE_MANDATORYFAVOURITES));
                        _a.label = 9;
                    case 9: return [4 /*yield*/, this.filterFavouritesNew(myFavouriteItems, LBFavouriteItems, _currentUserID)];
                    case 10:
                        favourites = _a.sent();
                        buttonDisabled = false;
                        this.setState(__assign({}, this.state, { favourites: favourites, buttonDisabled: buttonDisabled }), function () { _this.setState({ showPanel: false }); });
                        return [2 /*return*/];
                }
            });
        });
    };
    // private async _showPanelORG(): Promise<void> {
    //     console.info("My Start date" + new Date())
    //     let status: JSX.Element = <Spinner size={SpinnerSize.large} label='Henter...' />;
    //     let showPanel: boolean = true;
    //     // this.setState({ ...this.state, showPanel,status });
    //     // const audiences= await this._getLBAudience();
    //     await this._getUserObject().then((currentUser) => {
    //         this.setState({ ...this.state, currentUser });
    //     });
    //     const myFavouriteItems: IFavouriteItem[] = await this._getPersonalFavourites(this.state.currentUser.Id);
    //     const MY_Data: IFavouriteItem[] = await myFavouriteItems;
    //     const LBFavouriteItems: IFavouriteItem[] = await this._getMandatoryFavourites();
    //     const LB_Data: IFavouriteItem[] = await LBFavouriteItems;
    //     const favourites: IFavouriteItem[] = await this.filterFavourites(MY_Data, LB_Data);
    //     // const favourites = await resList;
    //     this.setState({ ...this.state, favourites }, this._setShowPanelState);
    //     // await this.filterFavourites(myFavouriteItems,LBFavouriteItems).then((res)=>{
    //     //     favourites=res;
    //     //     this.setState({...this.state, favourites },this._setShowPanelState);
    //     //  })
    //     // const favourites = [...LBFavouriteItems,...myFavouriteItems];
    //     // this.setState({...this.state, favourites },this._setShowPanelState);
    //     console.info("My End date" + new Date())
    // }
    TopMenu.prototype.filterFavourites = function (myFavouritesCollection, LBFavouritesCollection) {
        return __awaiter(this, void 0, void 0, function () {
            var returnlist, favouriteIndex, favourite, isCurrentUserMemberOfGroup, myFavouritesIndex, element;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        returnlist = [];
                        favouriteIndex = 0;
                        _a.label = 1;
                    case 1:
                        if (!(favouriteIndex < LBFavouritesCollection.length)) return [3 /*break*/, 5];
                        favourite = LBFavouritesCollection[favouriteIndex];
                        if (!favourite.LBAudience) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.CheckIfUserBelongsToGroup(favourite.LBAudience, this.state.currentUser.Email)
                            // const isCurrentUserMemberOfGroup = await isCurrentUserMemberOfGroupResponse;
                        ];
                    case 2:
                        isCurrentUserMemberOfGroup = _a.sent();
                        // const isCurrentUserMemberOfGroup = await isCurrentUserMemberOfGroupResponse;
                        if (isCurrentUserMemberOfGroup == true) {
                            returnlist.push(favourite);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        // myFavouritesCollection.push(favourite);
                        returnlist.push(favourite);
                        _a.label = 4;
                    case 4:
                        favouriteIndex++;
                        return [3 /*break*/, 1];
                    case 5:
                        for (myFavouritesIndex = 0; myFavouritesIndex < myFavouritesCollection.length; myFavouritesIndex++) {
                            element = myFavouritesCollection[myFavouritesIndex];
                            returnlist.push(element);
                        }
                        return [2 /*return*/, returnlist];
                }
            });
        });
    };
    TopMenu.prototype.filterFavouritesNew = function (myFavouritesCollection, LBFavouritesCollection, CurrentUserId) {
        return __awaiter(this, void 0, void 0, function () {
            var returnlist, favouriteIndex, favourite, isCurrentUserMemberOfGroup, myFavouritesIndex, element;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        returnlist = [];
                        favouriteIndex = 0;
                        _a.label = 1;
                    case 1:
                        if (!(favouriteIndex < LBFavouritesCollection.length)) return [3 /*break*/, 5];
                        favourite = LBFavouritesCollection[favouriteIndex];
                        if (!favourite.LBAudience) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.CheckIfUserBelongsToGroup(favourite.LBAudience, CurrentUserId)
                            // const isCurrentUserMemberOfGroup = await isCurrentUserMemberOfGroupResponse;
                        ];
                    case 2:
                        isCurrentUserMemberOfGroup = _a.sent();
                        // const isCurrentUserMemberOfGroup = await isCurrentUserMemberOfGroupResponse;
                        if (isCurrentUserMemberOfGroup == true) {
                            returnlist.push(favourite);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        returnlist.push(favourite);
                        _a.label = 4;
                    case 4:
                        favouriteIndex++;
                        return [3 /*break*/, 1];
                    case 5:
                        for (myFavouritesIndex = 0; myFavouritesIndex < myFavouritesCollection.length; myFavouritesIndex++) {
                            element = myFavouritesCollection[myFavouritesIndex];
                            returnlist.push(element);
                        }
                        return [2 /*return*/, returnlist];
                }
            });
        });
    };
    /// ********************* Dialog functions ********************* ///
    // Triggers when 'Tilføj button' is clicked and set the showDialog property on the FavouritesDialog component
    TopMenu.prototype._showDialog = function () {
        var itemInContext = {
            Id: 0,
            Title: "",
            IsDistributed: false,
            IsMandatory: false,
            IsPersonal: false,
            ItemUrl: null,
            LBAudience: null
        };
        var showDialog = true;
        this.setState(__assign({}, this.state, { showDialog: showDialog, itemInContext: itemInContext }));
    };
    TopMenu.prototype.handleBar = function (itemInContext) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Todo Clear sessionStorage
                this._GetAllFavouritesPre();
                // console.log(itemInContext)
                this._showPanel();
                return [2 /*return*/];
            });
        });
    };
    // This is a callback function that triggers when the 'Gem' button on the favouriteDialog component is clicked
    TopMenu.prototype.handleDialogClick = function (createNewItem, itemInContext) {
        return __awaiter(this, void 0, void 0, function () {
            var status, showDialog, showPanel;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.state.showDialog == true)) return [3 /*break*/, 3];
                        status = React.createElement(Spinner_1.Spinner, { size: Spinner_1.SpinnerSize.large, label: "Opretter favorit..." });
                        this.setState({ status: status });
                        showDialog = false;
                        showPanel = false;
                        this.setState(__assign({}, this.state, { status: status, showDialog: showDialog, showPanel: showPanel }));
                        if (!createNewItem) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.saveFavourite(itemInContext).then(function (result) {
                                if (result) {
                                    window.sessionStorage.removeItem(CACHE_CURRENTUSERFAVOURITES);
                                    _this._GetAllFavouritesPre();
                                }
                            })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        if (this.state.showDialog == false) {
                            this.setState({ showDialog: true });
                        }
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TopMenu.prototype._hideDialog = function () {
        this.setState({ showDialog: false });
    };
    /// ********************* Panel functions ********************* ///
    TopMenu.prototype._setShowPanelState = function () {
        this.setState({ showPanel: true });
    };
    TopMenu.prototype.render = function () {
        {
            return (this.state.buttonDisabled == true ?
                React.createElement("div", { className: "{styles.spinnerContainer}" },
                    React.createElement(Spinner_1.Spinner, { size: Spinner_1.SpinnerSize.medium, label: "Henter dine favoritter" })) :
                React.createElement("div", { className: "{styles.ccTopBar}" },
                    React.createElement(Button_1.PrimaryButton, { "data-id": "menuButton", title: "Vis mine favoritter", 
                        // text={this.state.buttonDisabled==true?"Henter dine favoritter":"Mine favoritter"}
                        text: "Mine favoritter", ariaLabel: "Vis", disabled: this.state.buttonDisabled, iconProps: { iconName: "View" }, onClick: this._showPanel.bind(this), className: LBFavourites_module_scss_1.default.addToFavouritesBtn }),
                    React.createElement(Button_1.PrimaryButton, { "data-id": "menuButton", title: "Tilf\u00F8j denne side til 'Mine favoritter'", 
                        // text={this.state.buttonDisabled==true?"Henter dine favoritter":"Tilføj til favoritter"}
                        text: "Tilf\u00F8j til 'Mine favoritter'", ariaLabel: "Tilf\u00F8j", disabled: this.state.buttonDisabled, iconProps: { iconName: "Add" }, onClick: this._showDialog.bind(this) }),
                    React.createElement(FavouritesPanel_1.default, { title: 'Dine favoritter', currentUserId: sessionStorage.getItem(CACHE_CURRENTUSERID), currentUser: this.state.currentUser, showPanel: this.state.showPanel, favourites: this.state.favourites, callbackRefreshFavourites: this.handleBar }),
                    React.createElement(FavouritesDialog_1.default, { itemInContext: this.state.itemInContext, dialogTitle: 'Opret favorit', showDialog: this.state.showDialog, callbackHandleDialogClick: this.handleDialogClick })));
        }
        // return (
        //     <div className="{styles.ccTopBar}">
        //         <PrimaryButton data-id="menuButton"
        //             title="Vis mine favoritter"
        //             // text={this.state.buttonDisabled==true?"Henter dine favoritter":"Mine favoritter"}
        //             text="Mine favoritter"
        //             ariaLabel="Vis"
        //             disabled={this.state.buttonDisabled}
        //             iconProps={{ iconName: "View" }}
        //             onClick={this._showPanel.bind(this)}
        //             className={styles.addToFavouritesBtn}
        //         />
        //         <PrimaryButton data-id="menuButton"
        //             title="Tilføj denne side til 'Mine favoritter'"
        //             // text={this.state.buttonDisabled==true?"Henter dine favoritter":"Tilføj til favoritter"}
        //             text="Tilføj til favoritter"
        //             ariaLabel="Tilføj"
        //             disabled={this.state.buttonDisabled}
        //             iconProps={{ iconName: "Add" }}
        //             onClick={this._showDialog.bind(this)}
        //         />
        //         <FavouritesPanel title='Dine favoritter' currentUser={this.state.currentUser} showPanel={this.state.showPanel} favourites={this.state.favourites} callbackRefreshFavourites={this.handleBar} />
        //         <FavouritesDialog itemInContext={this.state.itemInContext} dialogTitle='Opret favorit' showDialog={this.state.showDialog} callbackHandleDialogClick={this.handleDialogClick} />
        //     </div>
        //     )
    };
    TopMenu.prototype.CheckIfUserBelongsToGroup = function (groupName, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var resBool, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        resBool = false;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, sp_pnp_js_1.default.sp.web.siteGroups.getByName(groupName).users.get().then(function (res) {
                                return res.map(function (user) {
                                    // if(user.Email == this.state.currentUser.Email)
                                    // {
                                    //     resBool=  true
                                    // }
                                    if (user.Id == userId) {
                                        resBool = true;
                                    }
                                });
                            })];
                    case 2:
                        response = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/, resBool];
                }
            });
        });
    };
    TopMenu.prototype.CheckIfUserBelongsToGroupORG = function (groupName, userEmail) {
        return __awaiter(this, void 0, void 0, function () {
            var resBool, response, error_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        resBool = false;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, sp_pnp_js_1.default.sp.web.siteGroups.getByName(groupName).users.get()];
                    case 2:
                        response = _a.sent();
                        response.map(function (group) {
                            if (userEmail == _this.state.currentUser.Email) {
                                resBool = true;
                            }
                        });
                        // const data =await response
                        // return response;
                        resBool = false;
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/, resBool];
                }
            });
        });
    };
    TopMenu.prototype.saveFavourite = function (favouriteItem) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, sp_pnp_js_1.default.sp.web.lists.getByTitle(FAVOURITES_LIST_NAME).items.add({
                        'Title': favouriteItem.Title,
                        // 'Description': favouriteItem.Description,
                        'ItemUrl': window.location.href,
                        'Mandatory': false
                    }).then(function (result) { return __awaiter(_this, void 0, void 0, function () {
                        var addedItem;
                        return __generator(this, function (_a) {
                            addedItem = result.data;
                            // await this._getAllFavourites();
                            return [2 /*return*/, true];
                        });
                    }); }, function (error) {
                        return false;
                    })];
            });
        });
    };
    TopMenu.prototype._getMandatoryFavourites = function () {
        return __awaiter(this, void 0, void 0, function () {
            var returnItems;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        returnItems = [];
                        return [4 /*yield*/, sp_pnp_js_1.default.sp.web.lists.getByTitle(MANDATORY_FAVOURITES_LIST_NAME)
                                .items
                                .select("Id", "Title", "ItemUrl", "Description", "Mandatory", "Grupper/Title")
                                .expand("Grupper")
                                .filter("UnFollowers ne " + this.state.currentUser.Id)
                                .get()
                                .then(function (myFavourites) {
                                myFavourites.map(function (favourite) {
                                    var fItem = _this.CreateFavoriteItemObject(favourite, false);
                                    returnItems.push(fItem);
                                });
                                return returnItems;
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TopMenu.prototype.CreateFavoriteItemObject = function (favourite, IsPersonalFavourite) {
        return {
            Id: favourite.Id,
            IsDistributed: IsPersonalFavourite == true ? false : true,
            IsMandatory: favourite.Mandatory,
            IsPersonal: IsPersonalFavourite,
            ItemUrl: favourite.ItemUrl,
            Title: favourite.Title,
            LBAudience: favourite.Grupper ? favourite.Grupper[0].Title : null
        };
    };
    // private async _getPersonalFavourites(currentUserId: number): Promise<IFavouriteItem[]> {
    //     //const currentUserId: number = await this._getUserId();
    //     let returnItems: IFavouriteItem[] = [];
    //     // const currentUserObject: any = await this._getUserObject();
    //     //console.log(currentUserObject);
    //     return await pnp.sp.web.lists.getByTitle(FAVOURITES_LIST_NAME)
    //         .items
    //         .select(
    //             "Id",
    //             "Title",
    //             "ItemUrl",
    //             "Mandatory"
    //         )
    //         .filter("Author eq " + currentUserId)
    //         .usingCaching({
    //             expiration: pnp.util.dateAdd(new Date(), "minute", 20),
    //             key: "Personal favourites cache",
    //             storeName: "local"
    //         })
    //         .get()
    //         .then((myFavourites: any[]) => {
    //             myFavourites.map((item) => {
    //                 let fItem: IFavouriteItem = this.CreateFavoriteItemObject(item, true);
    //                 returnItems.push(fItem);
    //             })
    //             return returnItems;
    //         })
    //         .catch((error) => {
    //             Log.error(LOG_SOURCE, error);
    //             return [];
    //         });
    // }
    TopMenu.prototype._getUserObject = function () {
        try {
            return sp_pnp_js_1.default.sp.web.currentUser.get().then(function (result) {
                console.log(result);
                return result;
            });
        }
        catch (error) {
            console.log(error);
        }
    };
    return TopMenu;
}(React.Component));
exports.default = TopMenu;
//# sourceMappingURL=TopMenu.js.map