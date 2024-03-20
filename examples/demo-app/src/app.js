// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, { Component } from 'react';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import styled, { ThemeProvider } from 'styled-components';
import window from 'global/window';
import { connect } from 'react-redux';

/* 使用 kepler 默认的样式 */
import { theme } from '@kepler.gl/styles';
import Banner from './components/banner';
/* 公告栏内容组件 */
import Announcement, { FormLink } from './components/announcement';
import { replaceLoadDataModal } from './factories/load-data-modal';
import { replaceMapControl } from './factories/map-control';
import { replacePanelHeader } from './factories/panel-header';
import { CLOUD_PROVIDERS_CONFIGURATION, DEFAULT_FEATURE_FLAGS } from './constants/default-settings';
import { messages } from './constants/localization';

/* 加载自定义的 actions 定义 */
import {
  loadRemoteMap,
  loadSampleConfigurations,
  onExportFileSuccess,
  onLoadCloudMapSuccess
} from './actions';

/* 加载 kepler 中定义的 actions */
import { loadCloudMap, addDataToMap, addNotification, replaceDataInMap } from '@kepler.gl/actions';
// 试试从源代码加载
// import { loadCloudMap, addDataToMap, addNotification, replaceDataInMap } from '../../../src/actions';
/* Cloud Storage 服务提供者 Provider */
import { CLOUD_PROVIDERS } from './cloud-providers';

/*
这段代码是在JavaScript中使用ES6模块语法导入 @kepler.gl/components 的库。

injectComponents方法接受一个数组作为参数，数组中的每个元素都是一个需要注入到KeplerGl中的组件。
在这个例子中，有三个组件被注入：
replaceLoadDataModal(): 替换加载数据模态框
replaceMapControl(): 地图控件
replacePanelHeader(): 面板头部
*/
// npm package = '@kepler.gl/components';
// source code = '../../../src/components';
const KeplerGl = require('@kepler.gl/components')
  .injectComponents([
    replaceLoadDataModal(),
    replaceMapControl(),
    replacePanelHeader()
  ]);

// Sample data
/* eslint-disable no-unused-vars */
import sampleTripData, { testCsvData, sampleTripDataConfig } from './data/sample-trip-data';
/* 一个简单的 GeoJSON Polygon 数据 */
import sampleGeojson from './data/sample-small-geojson';
/* 一个 GeoJSON Point 数据 */
import sampleGeojsonPoints from './data/sample-geojson-points';
/* 还不知道干啥用的 GeoJSON 显示配置数据 */
import sampleGeojsonConfig from './data/sample-geojson-config';
import sampleH3Data, { config as h3MapConfig } from './data/sample-hex-id-csv';
import sampleS2Data, { config as s2MapConfig, dataId as s2DataId } from './data/sample-s2-data';
import sampleAnimateTrip, { animateTripDataId } from './data/sample-animate-trip-data';
/* 一个 CSV 的带 Icon 的数据 */
import sampleIconCsv, { config as savedMapConfig } from './data/sample-icon-csv';
import sampleGpsData from './data/sample-gps-data';

import { processCsvData, processGeojson } from '@kepler.gl/processors';
/* eslint-enable no-unused-vars */

const BannerHeight = 48;
const BannerKey = `banner-${FormLink}`;

// 是从state对象中获取demo属性下的keplerGl属性值，并将其返回。
const keplerGlGetState = state => state.demo.keplerGl;

const GlobalStyle = styled.div`
  font-family: ff-clan-web-pro, 'Helvetica Neue', Helvetica, sans-serif;
  font-weight: 400;
  font-size: 0.875em;
  line-height: 1.71429;

  *,
  *:before,
  *:after {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  li {
    margin: 0;
  }

  a {
    text-decoration: none;
    color: ${props => props.theme.labelColor};
  }
`;

const CONTAINER_STYLE = {
  transition: 'margin 1s, height 1s',
  position: 'absolute',
  width: '100%',
  height: '100%',
  left: 0,
  top: 0
};

class App extends Component {
  state = {
    showBanner: false,
    width: window.innerWidth,
    height: window.innerHeight
  };

  componentDidMount() {
    // if we pass an id as part of the url
    // we ry to fetch along map configurations
    const {
      params: { id, provider } = {},
      location: { query = {} } = {}
    } = this.props;

    const cloudProvider = CLOUD_PROVIDERS.find(c => c.name === provider);
    if (cloudProvider) {
      this.props.dispatch(
        loadCloudMap({
          loadParams: query,
          provider: cloudProvider,
          onSuccess: onLoadCloudMapSuccess
        })
      );
      return;
    }

    // Load sample using its id
    if (id) {
      this.props.dispatch(loadSampleConfigurations(id));
    }

    // Load map using a custom
    if (query.mapUrl) {
      // TODO?: validate map url
      this.props.dispatch(loadRemoteMap({ dataUrl: query.mapUrl }));
    }

    // delay zs to show the banner
    // 用于演示，一直显示 banner 提醒
    if (!window.localStorage.getItem(BannerKey)) {
      window.setTimeout(this._showBanner, 3000);
    }
    // load sample data
    this._loadSampleData();

    // Notifications
    // 显示右上角消息提醒
    // this._loadMockNotifications();
  }

  _showBanner = () => {
    this.setState({
      showBanner: true
    });
  };

  _hideBanner = () => {
    this.setState({
      showBanner: false
    });
  };

  _disableBanner = () => {
    this._hideBanner();
    window.localStorage.setItem(BannerKey, 'true');
  };

  _loadMockNotifications = () => {
    const notifications = [
      [{ message: '欢迎使用睿单Pro' }, 3000],
      [{ message: '连接数据出错', type: 'error' }, 1000],
      [{ message: '正在恢复连接', type: 'warning' }, 1000],
      [{ message: '连接成功', type: 'success' }, 1000]
    ];

    this._addNotifications(notifications);
  };

  _addNotifications(notifications) {
    if (notifications && notifications.length) {
      const [notification, timeout] = notifications[0];

      window.setTimeout(() => {
        this.props.dispatch(addNotification(notification));
        this._addNotifications(notifications.slice(1));
      }, timeout);
    }
  }

  /**
   * Demo 中的显示的数据示例
   */
  _loadSampleData() {
    this._loadPointData();
    this._loadGeojsonData();
    this._loadTripGeoJson();
    this._loadIconData();
    this._loadH3HexagonData();
    this._loadS2Data();
    // this._loadScenegraphLayer();
    this._loadGpsData();
  }

  _loadPointData() {
    this.props.dispatch(
      addDataToMap({
        datasets: {
          info: {
            label: '纽约出租车轨迹', // 'Sample Taxi Trips in New York City',
            id: 'test_trip_data'
          },
          data: sampleTripData
        },
        options: {
          // centerMap: true,
          keepExistingConfig: true
        },
        config: sampleTripDataConfig
      })
    );
  }

  _loadScenegraphLayer() {
    this.props.dispatch(
      addDataToMap({
        datasets: {
          info: {
            label: 'Sample Scenegraph Ducks',
            id: 'test_trip_data'
          },
          data: processCsvData(testCsvData)
        },
        config: {
          version: 'v1',
          config: {
            visState: {
              layers: [
                {
                  type: '3D',
                  config: {
                    dataId: 'test_trip_data',
                    columns: {
                      lat: 'gps_data.lat',
                      lng: 'gps_data.lng'
                    },
                    isVisible: true
                  }
                }
              ]
            }
          }
        }
      })
    );
  }

  _loadIconData() {
    // load icon data and config and process csv file
    this.props.dispatch(
      addDataToMap({
        datasets: [
          {
            info: {
              label: '图标数据', // 'Icon Data',
              id: 'test_icon_data'
            },
            data: processCsvData(sampleIconCsv)
          }
        ]
      })
    );
  }

  _loadTripGeoJson() {
    this.props.dispatch(
      addDataToMap({
        datasets: [
          {
            info: {
              label: '轨迹动画',
              id: animateTripDataId
            },
            data: processGeojson(sampleAnimateTrip)
          }
        ]
      })
    );
  }

  _replaceData = () => {
    // add geojson data
    const sliceData = processGeojson({
      type: 'FeatureCollection',
      features: sampleGeojsonPoints.features.slice(0, 5)
    });
    this._loadGeojsonData();
    window.setTimeout(() => {
      this.props.dispatch(
        replaceDataInMap({
          datasetToReplaceId: 'bart-stops-geo',
          datasetToUse: {
            info: { label: 'Bart Stops Geo Replaced', id: 'bart-stops-geo-2' },
            data: sliceData
          }
        })
      );
    }, 1000);
  };

  _loadGeojsonData() {
    // load geojson
    this.props.dispatch(
      addDataToMap({
        datasets: [
          {
            info: { label: 'Bart Stops Geo', id: 'bart-stops-geo' },
            data: processGeojson(sampleGeojsonPoints)
          },
          {
            info: { label: 'SF Zip Geo', id: 'sf-zip-geo' },
            data: processGeojson(sampleGeojson)
          }
        ],
        options: {
          keepExistingConfig: true
        },
        config: sampleGeojsonConfig
      })
    );
  }

  _loadH3HexagonData() {
    // load h3 hexagon
    this.props.dispatch(
      addDataToMap({
        datasets: [
          {
            info: {
              label: 'H3 六边形网格 V2', // 'H3 Hexagons V2',
              id: 'h3-hex-id'
            },
            data: processCsvData(sampleH3Data)
          }
        ],
        // 添加地图显示样式设置后，反而显示不出地图了
        // config: h3MapConfig,
        options: {
          keepExistingConfig: true
        }
      })
    );
  }

  _loadS2Data() {
    // load s2
    this.props.dispatch(
      addDataToMap({
        datasets: [
          {
            info: {
              label: 'S2 网格数据', // 'S2 Data',
              id: s2DataId
            },
            data: processCsvData(sampleS2Data)
          }
        ],
        config: s2MapConfig,
        options: {
          keepExistingConfig: true
        }
      })
    );
  }

  _loadGpsData() {
    this.props.dispatch(
      addDataToMap({
        datasets: [
          {
            info: {
              label: 'GPS 数据', // 'Gps Data',
              id: 'gps-data'
            },
            data: processCsvData(sampleGpsData)
          }
        ],
        options: {
          keepExistingConfig: true
        }
      })
    );
  }
  _toggleCloudModal = () => {
    // TODO: this lives only in the demo hence we use the state for now
    // REFCOTOR using redux
    this.setState({
      cloudModalOpen: !this.state.cloudModalOpen
    });
  };

  _getMapboxRef = (mapbox, index) => {
    if (!mapbox) {
      // The ref has been unset.
      // https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
      // console.log(`Map ${index} has closed`);
    } else {
      // We expect an Map created by KeplerGl's MapContainer.
      // https://visgl.github.io/react-map-gl/docs/api-reference/map
      const map = mapbox.getMap();
      map.on('zoomend', e => {
        // console.log(`Map ${index} zoom level: ${e.target.style.z}`);
      });
    }
  };

  render() {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle
          // this is to apply the same modal style as kepler.gl core
          // because styled-components doesn't always return a node
          // https://github.com/styled-components/styled-components/issues/617
          ref={node => {
            node ? (this.root = node) : null;
          }}
        >
          <Banner
            show={this.state.showBanner}
            height={BannerHeight}
            bgColor="#2E7CF6"
            onClose={this._hideBanner}
          >
            <Announcement onDisable={this._disableBanner} />
          </Banner>
          <div style={CONTAINER_STYLE}>
            <AutoSizer>
              {({ height, width }) => (
                <KeplerGl
                  /* 已经不对 mapbox 做支持了 */
                  // mapboxApiAccessToken={CLOUD_PROVIDERS_CONFIGURATION.MAPBOX_TOKEN}
                  id="map"
                  /*
                   * Specify path to keplerGl state, because it is not mount at the root
                   */
                  getState={keplerGlGetState}
                  width={width}
                  height={height}
                  cloudProviders={CLOUD_PROVIDERS}
                  // 1in18 消息翻译
                  localeMessages={messages}
                  onExportToCloudSuccess={onExportFileSuccess}
                  onLoadCloudMapSuccess={onLoadCloudMapSuccess}
                  featureFlags={DEFAULT_FEATURE_FLAGS}
                />
              )}
            </AutoSizer>
          </div>
        </GlobalStyle>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({ dispatch });

export default connect(mapStateToProps, dispatchToProps)(App);
