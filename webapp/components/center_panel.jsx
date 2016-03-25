// Copyright (c) 2015 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import TutorialIntroScreens from './tutorial/tutorial_intro_screens.jsx';
import CreatePost from './create_post.jsx';
import PostsViewContainer from './posts_view_container.jsx';
import PostFocusView from './post_focus_view.jsx';
import ChannelHeader from './channel_header.jsx';
import Navbar from './navbar.jsx';
import FileUploadOverlay from './file_upload_overlay.jsx';

import PreferenceStore from 'stores/preference_store.jsx';
import ChannelStore from 'stores/channel_store.jsx';
import UserStore from 'stores/user_store.jsx';

import * as Utils from 'utils/utils.jsx';
import * as GlobalActions from 'action_creators/global_actions.jsx';

import {FormattedMessage} from 'react-intl';

import Constants from 'utils/constants.jsx';
const TutorialSteps = Constants.TutorialSteps;
const Preferences = Constants.Preferences;

import React from 'react';
import {Link} from 'react-router';

export default class CenterPanel extends React.Component {
    constructor(props) {
        super(props);

        this.getStateFromStores = this.getStateFromStores.bind(this);
        this.isStateValid = this.isStateValid.bind(this);
        this.onStoresChange = this.onStoresChange.bind(this);

        this.state = this.getStateFromStores();
    }
    getStateFromStores() {
        const tutorialStep = PreferenceStore.getInt(Preferences.TUTORIAL_STEP, UserStore.getCurrentId(), 999);
        return {
            showTutorialScreens: tutorialStep <= TutorialSteps.INTRO_SCREENS,
            showPostFocus: ChannelStore.getPostMode() === ChannelStore.POST_MODE_FOCUS,
            user: UserStore.getCurrentUser(),
            channel: ChannelStore.getCurrent()
        };
    }
    isStateValid() {
        return this.state.user && this.state.channel && this.state.profiles;
    }
    onStoresChange() {
        this.setState(this.getStateFromStores());
    }
    componentDidMount() {
        PreferenceStore.addChangeListener(this.onStoresChange);
        ChannelStore.addChangeListener(this.onStoresChange);
        UserStore.addChangeListener(this.onStoresChange);
    }
    componentWillUnmount() {
        PreferenceStore.removeChangeListener(this.onStoresChange);
        ChannelStore.removeChangeListener(this.onStoresChange);
        UserStore.removeChangeListener(this.onStoresChange);
    }
    render() {
        if (!this.validState()) {
            return null;
        }
        const channel = this.state.channel;
        var handleClick = null;
        let postsContainer;
        let createPost;
        if (this.state.showTutorialScreens) {
            postsContainer = <TutorialIntroScreens/>;
            createPost = null;
        } else if (this.state.showPostFocus) {
            postsContainer = <PostFocusView profiles={this.state.profiles}/>;

            handleClick = function clickHandler(e) {
                e.preventDefault();
                GlobalActions.emitChannelClickEvent(channel);
            };

            createPost = (
                <div
                    id='archive-link-home'
                    onClick={handleClick}
                >
                    <Link to=''>
                        <FormattedMessage
                            id='center_panel.recent'
                            defaultMessage='Click here to jump to recent messages. '
                        />
                        <i className='fa fa-arrow-down'></i>
                    </Link>
                </div>
            );
        } else {
            );
        }

        return (
            {postsContainer}
            {createPost}
        );
    }
}

CenterPanel.defaultProps = {
};

CenterPanel.propTypes = {
};
