/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React, { ReactNode, useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { styled, SupersetTheme, css, t, useTheme } from '@superset-ui/core';
import cx from 'classnames';
import { Tooltip } from 'src/components/Tooltip';
import { debounce } from 'lodash';
import { Grid, Row } from 'src/components';
import { Menu, MenuMode, MainNav as DropdownMenu } from 'src/components/Menu';
import Button, { OnClickHandler } from 'src/components/Button';
import Icons from 'src/components/Icons';
import { MenuObjectProps } from 'src/types/bootstrapTypes';
// import RightMenuWrapper from './RightMenu';
import getBootstrapData from 'src/utils/getBootstrapData';
import { Global } from '@emotion/react';
import { GlobalStyles } from 'src/GlobalStyles';
// import { isFrontendRoute } from 'src/views/routes';
// import { Switch } from 'antd';

const StyledHeader = styled.div`

  .header {
    font-weight: ${({ theme }) => theme.typography.weights.bold};
    margin-right: ${({ theme }) => theme.gridUnit * 3}px;
    text-align: left;
    padding: ${({ theme }) => theme.gridUnit * 3}px;
    display: inline-block;
    line-height: ${({ theme }) => theme.gridUnit * 9}px;
    color:${({ theme }) => theme.colors.grayscale.dark2};
    a{
      color:${({ theme }) => theme.colors.grayscale.dark2};
      font-size: ${({ theme }) => theme.gridUnit * 5}px;
      text-decoration:none;
    }
  }
  .home {
    display:flex;
    align-items:center;
    h5{
      font-size: ${({ theme }) => theme.gridUnit * 5}px;
    }
    .breadcrumd-arrow{
      margin:0px ${({ theme }) => theme.gridUnit * 2}px;
    }
  }
  .nav-right {
    display: flex;
    align-items: center;
    padding: ${({ theme }) => theme.gridUnit * 3.5}px 0;
    margin-right: ${({ theme }) => theme.gridUnit * 3}px;
    float: right;
    position: absolute;
    right: 0;
    ul.ant-menu-root {
      padding: 0px;
      background-color:transparent;
    }
    li[role='menuitem'] {
      border: 0;
      border-bottom: none;
      &:hover {
        border-bottom: transparent;
      }
    }
  }
  .nav-right-collapse {
    display: flex;
    align-items: center;
    padding: 14px 0;
    margin-right: 0;
    float: left;
    padding-left: 10px;
  }
  .menu {
    background-color: ${({ theme }) => theme.colors.customBstStyles.subHeader};
    height: ${({ theme }) => theme.gridUnit * 16}px;
    align-items: center;
    .ant-menu-horizontal {
      line-height: inherit;
      .ant-menu-item {
        border-bottom: none;
        &:hover {
          border-bottom: none;
          text-decoration: none;
        }
      }
    }
    .ant-menu {
      padding: ${({ theme }) => theme.gridUnit * 4}px 0px;
    }
  }

  .ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item {
    margin: 0 ${({ theme }) => theme.gridUnit + 1}px;
  }

  .menu .ant-menu-item {
    li,
    div {
      a,
      div {
        font-size: ${({ theme }) => theme.typography.sizes.m}px;
        color: ${({ theme }) => theme.colors.grayscale.dark2};

        a {
          margin: 0;
          padding: ${({ theme }) => theme.gridUnit * 2}px
            ${({ theme }) => theme.gridUnit * 4}px;
          line-height: ${({ theme }) => theme.gridUnit * 5}px;

          &:hover {
            text-decoration: none;
          }
        }
      }

      &.no-router a {
        padding: ${({ theme }) => theme.gridUnit * 2}px
          ${({ theme }) => theme.gridUnit * 4}px;
      }

      &.active a {
        background: ${({ theme }) => theme.colors.grayscale.light5};
        border-radius: ${({ theme }) => theme.borderRadius}px;
      }
    }

    li.active > a,
    li.active > div,
    div.active > div,
    li > a:hover,
    li > a:focus,
    li > div:hover,
    div > div:hover,
    div > a:hover {
      background: ${({ theme }) => theme.colors.grayscale.light5};
      border-bottom: none;
      border-radius: ${({ theme }) => theme.borderRadius}px;
      margin-bottom: ${({ theme }) => theme.gridUnit * 2}px;
      text-decoration: none;
    }
  }

  .btn-link {
    padding: 10px 0;
  }
  .ant-menu-horizontal {
    border: none;
  }
  @media (max-width: 767px) {
    .header,
    .nav-right {
      position: relative;
      margin-left: ${({ theme }) => theme.gridUnit * 2}px;
    }
  }
  .ant-menu-submenu {
    span[role='img'] {
      position: absolute;
      right: ${({ theme }) => -theme.gridUnit + -2}px;
      top: ${({ theme }) => theme.gridUnit + 1}px !important;
    }
  }
  .dropdown-menu-links > div.ant-menu-submenu-title,
  .ant-menu-submenu-open.ant-menu-submenu-active > div.ant-menu-submenu-title {
    color: ${({ theme }) => theme.colors.grayscale.dark2};
    font-weight:500;
  }
  dropdown-menu-links > div.ant-menu-submenu-title, span[role='img'] svg{
    color: ${({ theme }) => theme.colors.grayscale.dark2} !important;
  }
`;

const styledDisabled = (theme: SupersetTheme) => css`
  color: ${theme.colors.grayscale.light1};

  .ant-menu-item-active {
    color: ${theme.colors.grayscale.light1};
    cursor: default;
  }
`;
const globalStyles = (theme: SupersetTheme) => css`
  .ant-menu-submenu.ant-menu-submenu-popup.ant-menu.ant-menu-light.ant-menu-submenu-placement-bottomLeft {
    border-radius: 0px;
  }
  .ant-menu-submenu.ant-menu-submenu-popup.ant-menu.ant-menu-light {
    border-radius: 0px;
  }
  .ant-menu-vertical{
    background-color: ${theme.colors.grayscale.light5} !important;
    .ant-menu-item {  
      &:hover {
      background-color: ${theme.colors.grayscale.light4};
      a{
        color: ${theme.colors.grayscale.dark2};
      }
       }
      a{
        color: ${theme.colors.grayscale.dark2};
      }
    }
    label{
      color: ${theme.colors.grayscale.dark2} !important;
    }
  }
  .ant-menu-submenu-vertical{
    color: ${theme.colors.grayscale.dark2} !important;
    i{
      color: ${theme.colors.grayscale.dark2} !important;
    }
  }
  .ant-menu-item-group-title{
    color: ${theme.colors.grayscale.dark2} ;
  }
  .ant-menu-item-only-child{
    color: ${theme.colors.grayscale.dark2} !important;
  }
  .ant-menu-vertical > .ant-menu-submenu.data-menu > .ant-menu-submenu-title {
    height: 28px;
    i {
      padding-right: ${theme.gridUnit * 2}px;
      margin-left: ${theme.gridUnit * 1.75}px;
    }
    
  }
`;
type MenuChild = {
  label: string;
  name: string;
  url?: string;
  usesRouter?: boolean;
  onClick?: () => void;
  'data-test'?: string;
};

export interface ButtonProps {
  name: ReactNode;
  onClick: OnClickHandler;
  'data-test'?: string;
  buttonStyle:
  | 'primary'
  | 'secondary'
  | 'dashed'
  | 'link'
  | 'warning'
  | 'success'
  | 'tertiary';
}

export interface SubMenuProps {
  buttons?: Array<ButtonProps>;
  name?: string | ReactNode;
  tabs?: MenuChild[];
  activeChild?: MenuChild['name'];
  /* If usesRouter is true, a react-router <Link> component will be used instead of href.
   *  ONLY set usesRouter to true if SubMenu is wrapped in a react-router <Router>;
   *  otherwise, a 'You should not use <Link> outside a <Router>' error will be thrown */
  usesRouter?: boolean;
  color?: string;
  dropDownLinks?: Array<MenuObjectProps>;
  rightMenuPresence?: boolean;
}

const { SubMenu } = DropdownMenu;

const SubMenuComponent: React.FunctionComponent<SubMenuProps> = props => {
  const [showMenu, setMenu] = useState<MenuMode>('horizontal');
  const [navRightStyle, setNavRightStyle] = useState('nav-right');

  let hasHistory = true;
  // If no parent <Router> component exists, useHistory throws an error
  try {
    useHistory();
  } catch (err) {
    // If error is thrown, we know not to use <Link> in render
    hasHistory = false;
  }

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 767) setMenu('inline');
      else setMenu('horizontal');

      if (
        props.buttons &&
        props.buttons.length >= 3 &&
        window.innerWidth >= 795
      ) {
        // eslint-disable-next-line no-unused-expressions
        setNavRightStyle('nav-right');
      } else if (
        props.buttons &&
        props.buttons.length >= 3 &&
        window.innerWidth <= 795
      ) {
        setNavRightStyle('nav-right-collapse');
      }
    }
    handleResize();
    const resize = debounce(handleResize, 10);
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [props.buttons]);

  const bootstrapData = getBootstrapData()
  // const { useBreakpoint } = Grid;
  // const screens = useBreakpoint();
  const theme = useTheme();
  // async function setThemeAsync(theme: string): Promise<void> {
  //   return new Promise<void>(resolve => {
  //     document.documentElement.setAttribute('data-theme', theme);
  //     localStorage.setItem('theme', theme);
  //     resolve();
  //   });
  // }

  // const [appliedTheme, setAppliedTheme] = useState<string>(
  //   localStorage.getItem('theme') || 'light',
  // );

  // useEffect(() => {
  //   (async () => {
  //     await setThemeAsync(appliedTheme);
  //   })();
  // }, [appliedTheme]);

  // const toggleTheme = async (): Promise<void> => {
  //   const newTheme = appliedTheme === 'light' ? 'dark' : 'light';

  //   // console.log(newTheme, 'newtheme');
  //   if (newTheme !== undefined) {
  //     setAppliedTheme(newTheme);
  //     await setThemeAsync(newTheme);
  //   }
  //   window.location.reload();
  // };
  return (
    <StyledHeader>
      <Global styles={globalStyles(theme)} />
      <GlobalStyles />
      <Row className="menu" role="navigation">
        {props.name &&
          <div className="header">
            {props.name === 'Home' ?
              <a href={bootstrapData.common.menu_data.brand.path}>
                {props.name}
              </a>
              : <div className='home'><a href={bootstrapData.common.menu_data.brand.path}>
                {/* <img src={brand.icon} alt={brand.alt} /> */}
                <h5>Home</h5>
              </a>
                <span className='breadcrumd-text'><span className='breadcrumd-arrow'> &gt; </span>{props.name}</span></div>}
          </div>}

        <Menu mode={showMenu} style={{ backgroundColor: 'transparent' }}>
          {props.tabs?.map(tab => {
            if ((props.usesRouter || hasHistory) && !!tab.usesRouter) {
              return (
                <Menu.Item key={tab.label}>
                  <div
                    role="tab"
                    data-test={tab['data-test']}
                    className={tab.name === props.activeChild ? 'active' : ''}
                  >
                    <div>
                      <Link to={tab.url || ''}>{tab.label}</Link>
                    </div>
                  </div>
                </Menu.Item>
              );
            }

            return (
              <Menu.Item key={tab.label}>
                <div
                  className={cx('no-router', {
                    active: tab.name === props.activeChild,
                  })}
                  role="tab"
                >
                  <a href={tab.url} onClick={tab.onClick}>
                    {tab.label}
                  </a>
                </div>
              </Menu.Item>
            );
          })}
        </Menu>

        <div className={navRightStyle}>
          <Menu mode="horizontal" triggerSubMenuAction="click">
            {props.dropDownLinks?.map((link, i) => (
              <SubMenu
                key={i}
                title={link.label}
                icon={<Icons.TriangleDown />}
                popupOffset={[10, 20]}
                className="dropdown-menu-links"
              >
                {link.childs?.map(item => {
                  if (typeof item === 'object') {
                    return item.disable ? (
                      <DropdownMenu.Item key={item.label} css={styledDisabled}>
                        <Tooltip
                          placement="top"
                          title={t(
                            "Enable 'Allow file uploads to database' in any database's settings",
                          )}
                        >
                          {item.label}
                        </Tooltip>
                      </DropdownMenu.Item>
                    ) : (
                      <DropdownMenu.Item key={item.label}>
                        <a href={item.url}>{item.label}</a>
                      </DropdownMenu.Item>
                    );
                  }
                  return null;
                })}
              </SubMenu>
            ))}
          </Menu>
          {props.rightMenuPresence &&
            // <div
            //   style={{
            //     display: 'flex',
            //     justifyContent: 'space-evenly',
            //     width: '100%',
            //     alignItems: 'center',
            //     marginInline: '20px',
            //   }}
            // >
            //   <p style={{ color: theme.colors.grayscale.dark2, marginTop: '8px' }}>Theme&nbsp;&nbsp;</p>
            //   <Switch
            //     defaultChecked={appliedTheme === 'dark'}
            //     onChange={toggleTheme}
            //   />

            //   <RightMenuWrapper
            //     align={screens.md ? 'flex-end' : 'flex-start'}
            //     navbarRight={bootstrapData.common.menu_data.navbar_right}
            //     isFrontendRoute={isFrontendRoute}
            //     environmentTag={bootstrapData.common.menu_data.environment_tag}
            //   />
            // </div>
            <Button>
              Theme
            </Button>
          }
          {props.buttons?.map((btn, i) => (
            <Button
              key={i}
              buttonStyle={btn.buttonStyle}
              onClick={btn.onClick}
              data-test={btn['data-test']}
            >
              {btn.name}
            </Button>
          ))}
        </div>
      </Row>
      {props.children}
    </StyledHeader>
  );
};

export default SubMenuComponent;
