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
var Panel_1 = require("office-ui-fabric-react/lib/Panel");
var Spinner_1 = require("office-ui-fabric-react/lib/Spinner");
var LBFavourites_module_scss_1 = require("../LBFavourites.module.scss");
var FavouriteItem_1 = require("../FavouriteItem/FavouriteItem");
var CACHEID = "LB_FAVOURITES";
var CACHE_CURRENTUSERID = CACHEID + "_currentUserId";
var CACHE_CURRENTUSERFAVOURITES = CACHEID + "_currentUserFavourites";
var CACHE_MANDATORYFAVOURITES = CACHEID + "_mandatoryFavourites";
var FAVOURITES_LIST_NAME = "Favourites";
var MANDATORY_FAVOURITES_LIST_NAME = "MandatoryFavourites";
var LOG_SOURCE = "LB_Favoritter_ApplicationCustomizer";
var FavouritesPanel = /** @class */ (function (_super) {
    __extends(FavouritesPanel, _super);
    function FavouritesPanel(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            status: React.createElement(Spinner_1.Spinner, { size: Spinner_1.SpinnerSize.large, label: "Henter..." }),
            // showPanel: false,
            showDialog: false,
            dialogTitle: "Test",
            favouriteItems: []
        };
        // this.UpdateFavouritePanel=this.UpdateFavouritePanel.bind(this);
        _this.UpdateFavouritePanel = _this.UpdateFavouritePanel.bind(_this);
        _this._deleteFavourite = _this._deleteFavourite.bind(_this);
        return _this;
    }
    FavouritesPanel.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", null,
            React.createElement(Panel_1.Panel, { isOpen: this.props.showPanel, type: Panel_1.PanelType.smallFixedNear, 
                // headerText="Mine favoritter"
                className: LBFavourites_module_scss_1.default.ccPanelMain, isLightDismiss: true },
                React.createElement("div", { className: LBFavourites_module_scss_1.default.ccPanelHeader }, "Mine favoritter"),
                this.props.favourites.sort(function (a, b) { return Number(b.IsMandatory) - Number(a.IsMandatory); }).map(function (item) {
                    return (React.createElement("div", null,
                        React.createElement(FavouriteItem_1.default, { item: item, callBackUpdateFavouriteItem: _this.UpdateFavouritePanel })));
                }))));
    };
    FavouritesPanel.prototype.UpdateFavouritePanel = function (item) {
        return __awaiter(this, void 0, void 0, function () {
            var itemResponse, unfollowersIDs_1, list;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(item.IsMandatory == false && item.IsDistributed == true)) return [3 /*break*/, 3];
                        window.sessionStorage.removeItem(CACHE_MANDATORYFAVOURITES);
                        return [4 /*yield*/, sp_pnp_js_1.default.sp.web.lists.getByTitle(MANDATORY_FAVOURITES_LIST_NAME).items.getById(item.Id).get()];
                    case 1:
                        itemResponse = _a.sent();
                        unfollowersIDs_1 = [];
                        if (itemResponse.UnFollowersId) {
                            itemResponse.UnFollowersId.map(function (unFollowers) {
                                unfollowersIDs_1.push(unFollowers);
                            });
                            unfollowersIDs_1.push(this.props.currentUserId);
                        }
                        else {
                            unfollowersIDs_1.push(this.props.currentUserId);
                        }
                        list = sp_pnp_js_1.default.sp.web.lists.getByTitle(MANDATORY_FAVOURITES_LIST_NAME);
                        window.sessionStorage.removeItem(CACHE_MANDATORYFAVOURITES);
                        return [4 /*yield*/, list.items.getById(item.Id).update({
                                UnFollowersId: { results: unfollowersIDs_1 }
                            }).then(this.props.callbackRefreshFavourites())];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        if (item.IsDistributed == false) {
                            window.sessionStorage.removeItem(CACHE_CURRENTUSERFAVOURITES);
                            this._deleteFavourite(item);
                        }
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
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
    FavouritesPanel.prototype._deleteFavourite = function (favouriteItem) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, sp_pnp_js_1.default.sp.web.lists.getByTitle(FAVOURITES_LIST_NAME).items.getById(favouriteItem.Id).delete()
                        .then(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.props.callbackRefreshFavourites(favouriteItem)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/, true];
                            }
                        });
                    }); }, function (error) {
                        return false;
                    })];
            });
        });
    };
    return FavouritesPanel;
}(React.Component));
exports.default = FavouritesPanel;
//# sourceMappingURL=FavouritesPanel.js.map