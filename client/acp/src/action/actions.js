import * as ActionTypes from '../model/action-types';
import * as Constants from '../model/constants';
import {getEditAwards} from '../model/selector/selectors';
import SocketService from '../service/socket-service';
import UploadService from '../service/upload-service';
import {awardUidToId} from '../util/utils';

/**
 * Flux Standard Actions
 *
 * Human-friendly. FSA actions should be easy to read and write by humans.
 * Useful. FSA actions should enable the creation of useful tools and abstractions.
 * Simple. FSA should be simple, straightforward, and flexible in its design.
 */

export function cancelAwardEdit(aid) {
    return {
        type   : ActionTypes.AWARD_EDIT_DID_CANCEL,
        payload: aid
    };
}

export function createAward(name, description) {
    return dispatch => {
        UploadService.sharedInstance().start(Constants.NEW_AWARD_ID)
            .then(() => SocketService.createAward(name, description))
            .then(() => {
                dispatch(resetNewAward());
                dispatch(getAwardsAll());
            })
            .then(() => {
                window.app.alertSuccess(`Award "${name}" is successfully created.`);
            })
            .catch(error => {
                window.app.alertError('Error did occur: ' + error);
            });
    };
}

export function deleteAward(aid) {
    return dispatch => {
        window.bootbox.confirm({
            size    : 'small',
            title   : 'Delete Award?',
            message : 'You are going to delete an award. It will not be possible to recover an award, and every user will lose this award.',
            buttons : {
                confirm: {
                    label: 'Delete'
                }
            },
            callback: result => {
                if (result === true) {
                    SocketService.deleteAward(awardUidToId(aid))
                        .then(() => {
                            dispatch(getAwardsAll());
                        })
                        .then(() => {
                            window.app.alertSuccess('Award is deleted.');
                        })
                        .catch(error => {
                            window.app.alertError('Error did occur: ' + JSON.stringify(error));
                        });
                }
            }
        });
    };
}

export function editAward(aid, award) {
    return {
        type   : ActionTypes.AWARD_DID_EDIT,
        payload: {aid, award}
    };
}

export function getAwardsAll() {
    return dispatch => {
        SocketService.getAwards().then(({awards}) => {
            dispatch(setAwards(awards));
        });
    };
}

export function getConfig() {
    return dispatch => {
        SocketService.getConfig().then(config => {
            dispatch(setConfig(config));
        });
    };
}

export function resetNewAward() {
    return {
        type: ActionTypes.NEW_AWARD_WILL_RESET
    };
}

export function resetNewAwardPreview() {
    return dispatch => {
        let loader = UploadService.sharedInstance().getLoader(Constants.NEW_AWARD_ID);
        if (loader !== undefined) {
            loader.removeAllFiles();
        }
        dispatch(setNewAwardPreview(null));
    };
}

export function saveAward(aid) {
    return (dispatch, getState) => {
        let awards = getEditAwards(getState());
        let {aid: id, name, desc} = awards[aid];

        Promise.resolve()
        // UploadService.sharedInstance().start(aid)
            .then(() => SocketService.editAward(id, name, desc))
            .then(() => {
                dispatch(cancelAwardEdit(aid));
                dispatch(getAwardsAll());
            })
            .then(() => {
                window.app.alertSuccess(`Award "${name}" is successfully updated.`);
            })
            .catch(error => {
                window.app.alertError('Error did occur: ' + error);
            });
    };
}

export function setAwardCreationState(state) {
    return {
        type   : ActionTypes.AWARD_CREATION_STATE_DID_UPDATE,
        payload: state
    };
}

export function setAwardEditIndex(index) {
    return {
        type   : ActionTypes.AWARD_EDIT_INDEX_DID_UPDATE,
        payload: index
    };
}

export function setAwardPreview(aid, value) {
    return {
        type   : ActionTypes.AWARD_PREVIEW_DID_CHANGE,
        payload: {aid, value}
    };
}

export function setAwards(list) {
    return {
        type   : ActionTypes.AWARDS_DID_UPDATE,
        payload: list
    };
}

export function setConfig(config) {
    return {
        type   : ActionTypes.CONFIG_DID_UPDATE,
        payload: config
    };
}

export function setNewAwardDescription(value) {
    return {
        type   : ActionTypes.NEW_AWARD_DESCRIPTION_DID_CHANGE,
        payload: value
    };
}

export function setNewAwardName(value) {
    return {
        type   : ActionTypes.NEW_AWARD_NAME_DID_CHANGE,
        payload: value
    };
}

export function setNewAwardPreview(value) {
    return {
        type   : ActionTypes.NEW_AWARD_PREVIEW_DID_CHANGE,
        payload: value
    };
}

export function setSection(sectionName) {
    return {
        type   : ActionTypes.SECTION_DID_UPDATE,
        payload: sectionName
    };
}

export function startAwardEdit(aid, award) {
    return {
        type   : ActionTypes.AWARD_EDIT_DID_START,
        payload: {aid, award}
    };
}
