// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {PureComponent} from 'react';
import styled, {ThemeProvider} from 'styled-components';
import {Container, Content, HeroImage, LogoImage, StyledCaption} from './common/styles';
import {theme} from '../styles';
import Header from './header';

const GITHUB_PROJECT = 'https://github.com/keplergl/kepler.gl';
const GITHUB_PROJECT_ISSUES = `${GITHUB_PROJECT}/issues`;
const MAILING_LIST_URL = 'https://groups.google.com/d/forum/kepler-gl';
const CONTRIBUTING_URL = 'https://docs.kepler.gl/contributing';

const StyledContainer = styled(Container)`
  background-color: black;
  height: 100vh;

  max-width: unset;

  .description {
    max-width: 800px;
  }

  .description-content {
    font-weight: 500;
  }

  h3 {
    margin-bottom: 24px;
  }

  a {
    text-decoration: underline;
    color: white;
  }

  a:visited {
    color: white;
  }

  img.hero-image {
    height: 100vh;
  }
`;

export default class Home extends PureComponent {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <div>
          <Header />
          <StyledContainer>
            <HeroImage className="hero-image" />
            <Content>
              <LogoImage />
              <StyledCaption>
                <div className="kg-home__caption__subtitle">技术支持</div>
                <div className="description">
                  <span className="description-content">尊敬的用户，</span>
                  <span className="description-content">感谢您购买我们的软件产品！为了保障您的权益，我们为您提供完善的售后技术支持服务。</span>
服务内容

我们的售后技术支持服务包括以下内容：

解答您在使用产品过程中遇到的疑问
协助您解决技术问题
提供产品升级和补丁
收集您的反馈和建议
服务时间

我们的技术支持团队每周 7 天，每天 24 小时为您服务。

服务方式

您可以通过以下方式获得技术支持：

在线帮助文档：访问我们的官方网站，查阅在线帮助文档。
知识库：访问我们的知识库，搜索常见问题的解决方案。
论坛：在我们的论坛上与其他用户交流，寻求帮助。
电话支持：拨打我们的客服电话，获得人工服务。
邮件支持：发送邮件至我们的客服邮箱，获得技术支持。
服务承诺

我们承诺在 24 小时内响应您的技术支持请求，并尽力在 48 小时内解决您的问题。

联系我们

如果您需要技术支持，请联系我们：

官方网站：https://www.virgindata.com
客服电话：18611178188
客服邮箱：xu.zhong@hotmail.com
感谢您的支持！

                </div>
              </StyledCaption>
            </Content>
          </StyledContainer>
        </div>
      </ThemeProvider>
    );
  }
}
