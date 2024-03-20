// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, { PureComponent } from 'react';
import window from 'global/window';

/*
styled-components是想知道我们如何增强CSS来设置React组件系统的样式的结果。
通过专注于单个用例，我们设法优化了开发人员的体验以及最终用户的输出。
在 '../styles.js' 中定义了全局 web 样式。
*/
import { ThemeProvider } from 'styled-components';
import { theme } from '../styles';

import { SECTIONS } from '../content';
import Hero from './hero';
import Showcase from './showcase';
import Examples from './examples';
import Tutorials from './tutorials';
import Walkthrough from './walkthrough';
import Features from './features';
import Ecosystems from './ecosystems';
import Studio from './studio';
import Footer from './footer';
import Section from './common/section';
import Header from './header';
import Banner from '../../../examples/demo-app/src/components/banner';
import Announcement from '../../../examples/demo-app/src/components/announcement';

const BannerKey = 'kgHideBanner-iiba';
const BannerHeight = 30;
const BACKGROUND_COLOR = '#2E7CF6';

const SECTION_CONTENT = {
  showcase: Showcase,
  walkthrough: Walkthrough,
  features: Features,
  examples: Examples,
  tutorials: Tutorials,
  ecosystems: Ecosystems,
  studio: Studio
};

export default class Home extends PureComponent {
  state = {
    showBanner: false
  };

  componentDidMount() {
    // delay 2s to show the banner
    // 为了演示，不记录 “已读” 状态
    if (true || !window.localStorage.getItem(BannerKey)) {
      window.setTimeout(this._showBanner, 3000);
    }
  }

  _showBanner = () => {
    this.setState({ showBanner: true });
  };

  _hideBanner = () => {
    this.setState({ showBanner: false });
  };

  _disableBanner = () => {
    this._hideBanner();
    // 为了演示，不记录 “已读” 状态
    // window.localStorage.setItem(BannerKey, 'true');
  };

  render() {
    return (
      <ThemeProvider theme={theme}>
        <div>
          {/* banner */}
          <Banner
            show={this.state.showBanner}
            height={BannerHeight}
            bgColor={BACKGROUND_COLOR}
            onClose={this._hideBanner}
          >
            {/* 公告栏 */}
            <Announcement onDisable={this._disableBanner} />
          </Banner>
          {/* Header 头部 */}
          <Header />
          {/* 内容区 - Hero */}
          <Hero />
          {
            // home 页上定义了几个 section 内容块
            SECTIONS.map(({ id, title, description, icon, isDark, background }, i) => {
              // 获取每个 secion 下定义的具体显示的 component
              return (<div />)
              const SectionContent = SECTION_CONTENT[id];
              return (
                <Section
                  key={`section-${i}`}
                  title={title}
                  description={description}
                  icon={icon}
                  isDark={isDark}
                  background={background}
                >
                  <SectionContent />
                </Section>
              );
            })}
          {/* Foot 脚页 */}
          <Footer />
        </div>
      </ThemeProvider>
    );
  }
}
