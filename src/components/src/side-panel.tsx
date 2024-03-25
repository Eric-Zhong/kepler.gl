// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo} from 'react';

import {
  EXPORT_DATA_ID,
  EXPORT_MAP_ID,
  SHARE_MAP_ID,
  SIDEBAR_PANELS,
  OVERWRITE_MAP_ID,
  SAVE_MAP_ID,
  EXPORT_IMAGE_ID,
  ADD_DATA_ID,
  ADD_MAP_STYLE_ID
} from '@kepler.gl/constants';

import {CursorClick, Layers, FilterFunnel, Settings} from './common/icons';

import SidebarFactory from './side-panel/side-bar';
import PanelHeaderFactory from './side-panel/panel-header';
import PanelToggleFactory from './side-panel/panel-toggle';
import LayerManagerFactory from './side-panel/layer-manager';
import FilterManagerFactory from './side-panel/filter-manager';
import InteractionManagerFactory from './side-panel/interaction-manager';
import MapManagerFactory from './side-panel/map-manager';
import CustomPanelsFactory from './side-panel/custom-panel';

import styled from 'styled-components';
import get from 'lodash.get';
import {SidePanelProps, SidePanelItem} from './types';

/**
 * React Div 组件 - 用于左侧 Sidebar 中 Tab 内容的显示
 */
export const StyledSidePanelContent = styled.div`
  ${props => props.theme.sidePanelScrollBar};
  flex-grow: 1;
  padding: ${props => props.theme.sidePanelInnerPadding}px;
  overflow-y: scroll;
  overflow-x: hidden;

  .side-panel__content__inner {
    display: flex;
    height: 100%;
    flex-direction: column;
  }
`;

/**
 * 当前 SidePanelFactory 工厂所依赖的父级 Factory
 */
SidePanelFactory.deps = [
  SidebarFactory,
  PanelHeaderFactory,
  PanelToggleFactory,
  LayerManagerFactory,
  FilterManagerFactory,
  InteractionManagerFactory,
  MapManagerFactory,
  CustomPanelsFactory
];

/**
 * Vertical sidebar containing input components for the rendering layers
 */
export default function SidePanelFactory(
  Sidebar: ReturnType<typeof SidebarFactory>,
  PanelHeader: ReturnType<typeof PanelHeaderFactory>,
  PanelToggle: ReturnType<typeof PanelToggleFactory>,
  LayerManager: ReturnType<typeof LayerManagerFactory>,
  FilterManager: ReturnType<typeof FilterManagerFactory>,
  InteractionManager: ReturnType<typeof InteractionManagerFactory>,
  MapManager: ReturnType<typeof MapManagerFactory>,
  CustomPanels: ReturnType<typeof CustomPanelsFactory>
) {
  // inject components
  const SIDEBAR_COMPONENTS = {
    layer: LayerManager,            /* 当前 SidePanelFactory 中 export 出的  */
    filter: FilterManager,          /* 当前 SidePanelFactory 中 export 出的  */
    interaction: InteractionManager,/* 当前 SidePanelFactory 中 export 出的  */
    map: MapManager                 /* 当前 SidePanelFactory 中 export 出的  */
  };

  const SIDEBAR_ICONS = {
    layer: Layers,                  /* 在 ./common/icons 中定义的 */
    filter: FilterFunnel,           /* 在 ./common/icons 中定义的 */
    interaction: Settings,          /* 在 ./common/icons 中定义的 */
    map: CursorClick                /* 在 ./common/icons 中定义的 */
  };

  // We should defined sidebar panels here but keeping them for backward compatible
  // 我们应该在这里定义侧边栏面板，但是为了向后兼容，保留了它们。
  /*
  SIDEBAR_PANELS 中用 JSON 定义了默认的 panel， 关键配置：{id, label, onClick}
  SidePanelItem[]: 根据 SIDEBAR_PANELS 中定义的默认 panel 配置，重新生成 react 的 component 组件的定义对象。
  {
    id: '',
    label: '',
    onClick: null,
    component: [React Component 组件 “Tab 的内容显示区”]
    iconComponent: [React Component 组件 “Tab上显示的图标”]
  }
   */
  const fullPanels: SidePanelItem[] = SIDEBAR_PANELS.map(component => ({
    ...component,
    /* 通过 id  在 IoC 注入的 components 进行查找 - 找 tab body*/
    component: SIDEBAR_COMPONENTS[component.id],
    /*  通过 id 在 IoC 注入的 Compoents 中进行查找 - 找 tab head icon */
    iconComponent: SIDEBAR_ICONS[component.id]
  }));

  const getCustomPanelProps = get(CustomPanels, ['defaultProps', 'getProps']) || (() => ({}));

  console.log('[Kepler debug]', '\t', '@kepler.gl/components/side-panel.tsx', '\t', 'export function SidePanelFactory(..)', '生成 SidePanelFactory 工厂', '');
  console.log('[Kepler debug]', '\t', '@kepler.gl/components/side-panel.tsx', '\t', 'export function SidePanelFactory(..)', 'fullPanels', fullPanels);
  console.log('[Kepler debug]', '\t', '@kepler.gl/components/side-panel.tsx', '\t', 'export function SidePanelFactory(..)', 'getCustomPanelProps', getCustomPanelProps);

  // eslint-disable-next-line max-statements
  const SidePanel: React.FC<SidePanelProps> = (props: SidePanelProps) => {
    const {
      appName,
      appWebsite,
      availableProviders = {},
      datasets,
      filters,
      layers,
      layerBlending,
      overlayBlending,
      layerClasses,
      layerOrder,
      interactionConfig,
      panels = fullPanels,
      mapInfo,
      mapSaved,
      mapStateActions,
      mapStyle,
      mapStyleActions,
      onSaveMap,
      uiState,
      uiStateActions,
      visStateActions,
      version,
      width
    } = props;
    const {openDeleteModal, toggleModal, toggleSidePanel} = uiStateActions;
    const {activeSidePanel} = uiState;
    const {setMapInfo, showDatasetTable, updateTableColor} = visStateActions;
    const {hasShare, hasStorage} = availableProviders;

    const {title} = mapInfo;

    const isOpen = Boolean(activeSidePanel);

    const _onOpenOrClose = useCallback(() => toggleSidePanel(activeSidePanel ? '' : 'layer'), [
      activeSidePanel,
      toggleSidePanel
    ]);

    const onClickExportImage = useCallback(() => toggleModal(EXPORT_IMAGE_ID), [toggleModal]);
    const onClickExportData = useCallback(() => toggleModal(EXPORT_DATA_ID), [toggleModal]);
    const onClickExportMap = useCallback(() => toggleModal(EXPORT_MAP_ID), [toggleModal]);
    const onClickSaveToStorage = useCallback(
      () => toggleModal(mapSaved ? OVERWRITE_MAP_ID : SAVE_MAP_ID),
      [mapSaved, toggleModal]
    );
    const onClickSaveAsToStorage = useCallback(() => {
      setMapInfo({
        title: `${title || 'Kepler.gl'} (Copy)`
      });

      toggleModal(SAVE_MAP_ID);
    }, [title, setMapInfo, toggleModal]);
    const onClickShareMap = useCallback(() => toggleModal(SHARE_MAP_ID), [toggleModal]);
    const onShowDatasetTable = useCallback(dataId => showDatasetTable(dataId), [showDatasetTable]);
    const onUpdateTableColor = useCallback(
      (dataId, newColor) => updateTableColor(dataId, newColor),
      [updateTableColor]
    );
    const onShowAddDataModal = useCallback(() => toggleModal(ADD_DATA_ID), [toggleModal]);
    const onShowAddMapStyleModal = useCallback(() => toggleModal(ADD_MAP_STYLE_ID), [toggleModal]);
    const onRemoveDataset = useCallback(dataId => openDeleteModal(dataId), [openDeleteModal]);

    const currentPanel = useMemo(() => panels.find(({id}) => id === activeSidePanel) || null, [
      activeSidePanel,
      panels
    ]);

    const customPanelProps = useMemo(() => getCustomPanelProps(props), [props]);

    /**
     * 当前已选中的 Tab 标签页的内容 content 组件
     */
    const PanelComponent = currentPanel?.component;

    console.log('[Kepler debug]', '\t', '@kepler.gl/components/side-panel.tsx', '\t', 'export function SidePanelFactory(..)', 'currentPanel', PanelComponent);

    return (
      <Sidebar
        width={width}
        isOpen={isOpen}
        shouldShowCollapseButton={uiState.isSidePanelCloseButtonVisible}
        minifiedWidth={0}
        onOpenOrClose={_onOpenOrClose}
      >
        {/* Tab 标签页头部 Icon 区 */}
        <PanelHeader
          appName={appName}
          version={version}
          appWebsite={appWebsite}
          visibleDropdown={uiState.visibleDropdown}
          showExportDropdown={uiStateActions.showExportDropdown}
          hideExportDropdown={uiStateActions.hideExportDropdown}
          onExportImage={onClickExportImage}
          onExportData={onClickExportData}
          onExportMap={onClickExportMap}
          onSaveMap={hasStorage ? onSaveMap : undefined}
          onSaveToStorage={hasStorage ? onClickSaveToStorage : null}
          onSaveAsToStorage={hasStorage && mapSaved ? onClickSaveAsToStorage : null}
          onShareMap={hasShare ? onClickShareMap : null}
        />
        {/* the next two components should be moved into one */}
        {/* but i am keeping them because of backward compatibility */}
        <PanelToggle
          panels={panels}
          activePanel={activeSidePanel}
          togglePanel={uiStateActions.toggleSidePanel}
        />
        <StyledSidePanelContent className="side-panel__content">
          <div className="side-panel__content__inner">
            {PanelComponent ? (
              <PanelComponent
                datasets={datasets}
                filters={filters}
                layers={layers}
                layerClasses={layerClasses}
                layerOrder={layerOrder}
                layerBlending={layerBlending}
                overlayBlending={overlayBlending}
                mapStyle={mapStyle}
                mapStyleActions={mapStyleActions}
                mapStateActions={mapStateActions}
                interactionConfig={interactionConfig}
                removeDataset={onRemoveDataset}
                showDatasetTable={onShowDatasetTable}
                updateTableColor={onUpdateTableColor}
                showAddDataModal={onShowAddDataModal}
                showAddMapStyleModal={onShowAddMapStyleModal}
                uiStateActions={uiStateActions}
                visStateActions={visStateActions}
                panelMetadata={currentPanel}
                panelListView={
                  currentPanel?.id === 'layer'
                    ? uiState.layerPanelListView
                    : currentPanel?.id === 'filter'
                    ? uiState.filterPanelListView
                    : null
                }
              />
            ) : null}
            {/* 用户自定义的 SidePanel 内容放在这里 */}
            <CustomPanels
              {...customPanelProps}
              activeSidePanel={activeSidePanel}
              updateTableColor={onUpdateTableColor}
            />
          </div>
        </StyledSidePanelContent>
      </Sidebar>
    );
  };

  SidePanel.defaultProps = {
    panels: fullPanels,
    mapInfo: {}
  };

  return SidePanel;
}
