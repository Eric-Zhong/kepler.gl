// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {SidePanelItem} from '../types';
import { Icons } from '../common';

export type CustomPanelsProps<P> = {
  panels: SidePanelItem[];
  getProps?: (props: SidePanelItem) => P;
};

// This is a dummy component that can be replaced to inject more side panel sub panels into the side bar
function CustomPanelsFactory<P>() {
  const CustomPanels: React.FC<CustomPanelsProps<P>> = props => {
    return <div />;
  };

  console.log('xuzhong: 这里取消了注释代码，但发现没有看到显示后的效果。')
  CustomPanels.defaultProps = {
    // provide a list of additional panels
    panels: [
      {
        id: 'rocket',
        label: 'Rocket',
        iconComponent: Icons.Rocket,
        component: ()=>(<h1>Rocket Panel</h1>),
      },
      {
        id: 'chart',
        label: 'Chart',
        iconComponent: Icons.LineChart,
        component: ()=>(<h1>Chart Panel</h1>),
      }
    ],
    // prop selector from side panel props
    getProps: (sidePanelProps: SidePanelItem) => ({} as P)
  };

  return CustomPanels;
}

export default CustomPanelsFactory;
