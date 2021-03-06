import React, { Component } from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
    Container,
    Header,
    Avatar,
    Name,
    Bio,
    Stars,
    Starred,
    OwnerAvatar,
    Info,
    Title,
    Author,
} from './styles';

export default class User extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('user').name,
    });

    static propTypes = {
        navigation: PropTypes.shape({
            getParam: PropTypes.func,
            navigate: PropTypes.func,
        }).isRequired,
    };

    state = {
        stars: [],
        loading: false,
        page: 1,
    };

    async componentDidMount() {
        const { navigation } = this.props;
        const { page } = this.state;
        const user = navigation.getParam('user');

        this.setState({ loading: true });

        const response = await api.get(`/users/${user.login}/starred`, {
            params: {
                page,
            },
        });

        this.setState({ stars: response.data, loading: false });
    }

    loadMore = async () => {
        const { navigation } = this.props;

        const { page, stars } = this.state;

        const user = navigation.getParam('user');

        const response = await api.get(`/users/${user.login}/starred`, {
            params: {
                page: page + 1,
            },
        });

        this.setState({ stars: [...stars, ...response.data], page: page + 1 });
    };

    loadStars = async () => {
        const { navigation } = this.props;
        const user = navigation.getParam('user');

        this.setState({ loading: true });

        const response = await api.get(`/users/${user.login}/starred`, {
            params: {
                page: 1,
            },
        });

        this.setState({ stars: response.data, loading: false, page: 1 });
    };

    handleNavigate = repository => {
        const { navigation } = this.props;

        navigation.navigate('Repository', { repository });
    };

    render() {
        const { navigation } = this.props;
        const { stars, loading } = this.state;

        const user = navigation.getParam('user');

        return (
            <Container>
                <Header>
                    <Avatar source={{ uri: user.avatar }} />
                    <Name>{user.name}</Name>
                    <Bio>{user.bio}</Bio>
                </Header>
                {loading ? (
                    <ActivityIndicator
                        color="#7159c1"
                        size={80}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    />
                ) : (
                    <Stars
                        onRefresh={this.loadStars}
                        refreshing={loading}
                        onEndReachedThreshold={0.2}
                        onEndReached={this.loadMore}
                        data={stars}
                        keyExtractor={star => String(star.id)}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => this.handleNavigate(item)}
                            >
                                <Starred>
                                    <OwnerAvatar
                                        source={{ uri: item.owner.avatar_url }}
                                    />
                                    <Info>
                                        <Title>{item.name}</Title>
                                        <Author>{item.owner.login}</Author>
                                    </Info>
                                </Starred>
                            </TouchableOpacity>
                        )}
                    />
                )}
            </Container>
        );
    }
}
