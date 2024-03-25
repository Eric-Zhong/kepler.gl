// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {SidebarFactory, Icons} from '../../../../src/components/src';
import styled from 'styled-components';

const StyledSideBarContainer = styled.div`
  .side-panel--container {
    transform: scale(0.85);
    transform-origin: top left;
    height: 117.64%;
    padding-top: 0;
    padding-right: 0;
    padding-bottom: 0;
    padding-left: 0;
  }
`;

const StyledCloseButton = styled.div`
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.primaryBtnBgd};
  color: ${props => props.theme.primaryBtnColor};
  display: flex;
  height: 46px;
  position: absolute;
  top: 0;
  width: 80px;
  right: 0;

  :hover {
    cursor: pointer;
    background-color: ${props => props.theme.primaryBtnBgdHover};
  }
`;

/**
 * 定义了一个左侧栏收起 Button 的 Factory。
 * @returns 新的左侧栏收起 Button
 */
const CloseButtonFactory = () => {
  /**
   * 定义开/关按键
   * @param {onClick, isOpen} onClick回调函数, isOpen开/关状态 
   * @returns 
   */
  const CloseButton = ({onClick, isOpen}) => (
    <StyledCloseButton className="side-bar__close" onClick={onClick}>
      <span>收起 </span>
      <Icons.ArrowRight
        height="18px"
        style={{
          transform: `rotate(${isOpen ? 180 : 0}deg)`, // 控制显示的箭头方向
          marginLeft: isOpen ? 0 : '30px',
          marginRight: 0,
        }}
      />
    </StyledCloseButton>
  );
  return CloseButton;
};

// Custom sidebar will render kepler.gl default side bar
// adding a wrapper component to edit its style
function CustomSidebarFactory(CloseButton) {
  const SideBar = SidebarFactory(CloseButton);
  const CustomSidebar = props => (
    <StyledSideBarContainer>
      <SideBar {...props} />
    </StyledSideBarContainer>
  );
  return CustomSidebar;
}

// You can add custom dependencies to your custom factory
CustomSidebarFactory.deps = [CloseButtonFactory];

export default CustomSidebarFactory;
