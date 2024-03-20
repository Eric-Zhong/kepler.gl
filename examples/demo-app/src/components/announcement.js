// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
/*
它允许你使用CSS样式来定义组件的外观。通过使用styled-components，
你可以将CSS样式直接嵌入到JavaScript代码中，从而实现更直观、可维护和可重用的样式。
*/
import styled from 'styled-components';

const StyledText = styled.div`
  font-size: 12px;
`;

const StyledLink = styled.a`
  text-decoration: underline !important;
  color: white !important;
  font-weight: 500;
  margin-left: 8px;

  :hover {
    cursor: pointer;
  }
`;

const DisableBanner = styled.div`
  display: inline-block;
  margin-left: 20px;
`;

// We are using the link to make sure users who have seen
// previous banners can see this one because we check localstorage key
export const FormLink = 'https://shan990829.typeform.com/to/RbCAXt';

const Announcement = ({onDisable}) => (
  <StyledText>
    <span>
      睿单.Pro 已于2024年1月20日发布了 v1.0 版。
    </span>
    {onDisable ? (
      <DisableBanner>
        <StyledLink onClick={onDisable}>关闭</StyledLink>
      </DisableBanner>
    ) : null}
  </StyledText>
);

export default Announcement;
