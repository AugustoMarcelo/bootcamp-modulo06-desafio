import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';

const styles = StyleSheet.create({
    WebViewStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    ActivityIndicatorLoading: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
    },
});

export default class Repository extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('repository').name,
    });

    static propTypes = {
        navigation: PropTypes.shape({
            getParam: PropTypes.func,
        }).isRequired,
    };

    ActivityIndicatorLoading() {
        return (
            <ActivityIndicator
                color="#7159c1"
                size={80}
                style={styles.ActivityIndicatorLoading}
            />
        );
    }

    render() {
        const { navigation } = this.props;
        const repository = navigation.getParam('repository');

        return (
            <WebView
                source={{ uri: repository.html_url }}
                style={styles.WebViewStyle}
                renderLoading={this.ActivityIndicatorLoading}
                startInLoadingState
            />
        );
    }
}
