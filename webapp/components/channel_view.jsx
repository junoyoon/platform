// Copyright (c) 2015 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import React from 'react';

import ChannelHeader from 'components/channel_header.jsx';
import PostsViewContainer from 'components/posts_view_container.jsx';
import CreatePost from 'components/create_post.jsx';

import ChannelStore from 'stores/channel_store.jsx';
import UserStore from 'stores/user_store.jsx';

export default class ChannelView extends React.Component {
    constructor(props) {
        super(props);

        this.getStateFromStores = this.getStateFromStores.bind(this);
        this.isStateValid = this.isStateValid.bind(this);
        this.updateState = this.updateState.bind(this);

        this.state = this.getStateFromStores(props);
    }
    getStateFromStores(props) {
        const channel = ChannelStore.getByName(props.params.channel);
        const channelId = channel ? channel.id : '';
        const profiles = JSON.parse(JSON.stringify(UserStore.getProfiles()));
        return {
            channelId,
            profiles
        };
    }
    isStateValid() {
        return this.state.channelId !== '' && this.state.profiles;
    }
    updateState() {
        this.setState(this.getStateFromStores(this.props));
    }
    componentDidMount() {
        ChannelStore.addChangeListener(this.updateState);
    }
    componentWillUnmount() {
        ChannelStore.removeChangeListener(this.updateState);
    }
    componentWillReceiveProps(nextProps) {
        this.setState(this.getStateFromStores(nextProps));
    }
    render() {
        return (
            <div
                id='app-content'
                className='app__content'
            >
                <ChannelHeader
                    channelId={this.state.channelId}
                />
                <PostsViewContainer profiles={this.state.profiles}/>
                <div
                    className='post-create__container'
                    id='post-create'
                >
                    <CreatePost/>
                </div>
            </div>
        );
    }
}
ChannelView.defaultProps = {
};

ChannelView.propTypes = {
    params: React.PropTypes.object.isRequired
};
