// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, { Component } from 'react';
import { connect } from 'react-redux';
// import {addDataToMap, wrapTo} from '@kepler.gl/actions';
import { addDataToMap, wrapTo } from '../../../src/actions/src';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import styled from 'styled-components';
import { theme } from '../../../src/styles';

import sampleData, { config } from './data/sample-data';

const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

import {
  SidebarFactory,
  PanelHeaderFactory,
  PanelToggleFactory,
  CustomPanelsFactory,
  MapPopoverFactory,
  injectComponents
} from '../../../src/components';

import CustomPanelHeaderFactory from './components/panel-header';
import CustomSidebarFactory from './components/side-bar';
import CustomPanelToggleFactory from './components/panel-toggle';
import CustomSidePanelsFactory from './components/custom-panel';
import CustomMapPopoverFactory from './components/custom-map-popover';

/**
 * 定义了一个用于显示 app config 配置信息的 div panel。
 * 用于显示 json 数据。
 */
const StyledMapConfigDisplay = styled.div`
  position: absolute;
  z-index: 100;
  bottom: 30px;
  right: 10px;
  background-color: ${theme.sidePanelBg};
  font-size: 11px;
  width: 500px;
  color: ${theme.textColor};
  word-wrap: break-word;
  min-height: 30px;
  padding: 16px;
`;

// Inject custom components
const KeplerGl = injectComponents([
  [SidebarFactory, CustomSidebarFactory],
  [PanelHeaderFactory, CustomPanelHeaderFactory],
  [PanelToggleFactory, CustomPanelToggleFactory],
  [CustomPanelsFactory, CustomSidePanelsFactory],
  [MapPopoverFactory, CustomMapPopoverFactory]
]);

class App extends Component {
  componentDidMount() {
    this.props.dispatch(wrapTo('map1', addDataToMap({ datasets: sampleData, config })));
  }

  render() {
    return (
      <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
        <AutoSizer>
          {({ height, width }) => (
            <KeplerGl id="map1"
              mapboxApiAccessToken={MAPBOX_TOKEN}
              width={width}
              height={height}
            />
          )}
        </AutoSizer>
        {/* 在页面框架下定义了一个显示 app config 的 json 显示 div panel */}
        <StyledMapConfigDisplay>
          {
            this.props.app.mapConfig
              ?
              // div panel 中显示 app config 的 json 数据，且被格式化了
              JSON.stringify(this.props.app.mapConfig)
              // div panel 中默认显示的内容。
              // : 'Click Save Config to Display Config Here'
              : '视图配置信息 (点击 "Save Config")'
          }
        </StyledMapConfigDisplay>
      </div>
    );
  }
}

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({ dispatch });

export default connect(mapStateToProps, dispatchToProps)(App);
