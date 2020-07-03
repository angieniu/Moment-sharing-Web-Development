import React, {Component} from 'react';
import { POS_KEY } from '../constants';

import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
} from "react-google-maps";

import AroundMarker from './AroundMarker';


class NormalAroundMap extends Component {
    getMapRef = (mapInstance) => {
        console.log(mapInstance)
        this.map = mapInstance;
        window.map = mapInstance;
    }

    reloadMarker = () => {
        //console.log(1);
        // get location
        const center = this.getCenter();
        // get radius
        const radius = this.getRadius();
        // this.props.loadNearbyPosts(center, radius);
        // reload post -> call this.props.loadPostsByTopic 数据从子组件传给父组件home.js
        this.props.loadPostsByTopic(center, radius);
    }

    getCenter() {
        const center = this.map.getCenter();
        console.log('==>', center)
        return { lat: center.lat(), lon: center.lng() };
    }

    getRadius() {
        const center = this.map.getCenter();
        const bounds = this.map.getBounds();
        console.log("===>", bounds);
        if (center && bounds) {
            const ne = bounds.getNorthEast();
            console.log('ne ->', ne);
            const right = new window.google.maps.LatLng(center.lat(), ne.lng());
            console.log('right->', right)
            return 0.001 * window.google.maps.geometry.spherical.computeDistanceBetween(center, right);
        }
    }

    render() {
        // inspect, application, localstorage, pos_key
        const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY));
        return (
            <GoogleMap
                ref={this.getMapRef}
                // 原生js: virtual element id or class; react to get virtual element: ref
                defaultZoom={11}
                defaultCenter={{ lat, lng: lon }}
                onDragEnd={this.reloadMarker}
                onZoomChanged={this.reloadMarker}
            >
                /
                {this.props.posts.map((post) => <AroundMarker   key={post.url} />)}
                {/*/ 针对一个array创建出来多个相同的component，应该给key，用来做diff算法{this.props.posts.map((post) => <AroundMarker post={post} key={post.url} />)}*/}
            </GoogleMap>
        );
    }
}

const AroundMap = withScriptjs(withGoogleMap(NormalAroundMap));

export default AroundMap;
