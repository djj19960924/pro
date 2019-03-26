import React from "react";
import { Layout } from "antd";
import router from "umi/router";
import DocumentTitle from "react-document-title";
import isEqual from "lodash/isEqual";
import memoizeOne from "memoize-one";
import { connect } from "dva";
import { ContainerQuery } from "react-container-query";
import classNames from "classnames";
import pathToRegexp from "path-to-regexp";
import { enquireScreen, unenquireScreen } from "enquire-js";
import { formatMessage } from "umi/locale";
import SiderMenu from "@/components/SiderMenu";
import Authorized from "@/utils/Authorized";
import SettingDrawer from "@/components/SettingDrawer";
import logo from "../assets/logo.png";
import Footer from "./Footer";
import Header from "./Header";
import Context from "./MenuContext";
import Exception403 from "../pages/Exception/403";
import styles from "./BasicLayout.less";
import { rc } from "../global";
import { getPageQuery } from "@/utils/utils";
import cookie from "react-cookies";

const { Content } = Layout;

//根据路由生成菜单
function formatter(data, parentPath = "", parentAuthority, parentName) {
  return data.map(item => {
    let locale = "menu";
    if (parentName && item.name) {
      locale = `${parentName}.${item.name}`;
    } else if (item.name) {
      locale = `menu.${item.name}`;
    } else if (parentName) {
      locale = parentName;
    }
    const result = {
      ...item,
      locale,
      authority: item.authority || parentAuthority
    };
    if (item.routes) {
      const children = formatter(
        item.routes,
        `${parentPath}${item.path}/`,
        item.authority,
        locale
      );
      // Reduce memory usage
      result.children = children;
    }
    delete result.routes;
    return result;
  });
}

const query = {
  "screen-xs": {
    maxWidth: 575
  },
  "screen-sm": {
    minWidth: 576,
    maxWidth: 767
  },
  "screen-md": {
    minWidth: 768,
    maxWidth: 991
  },
  "screen-lg": {
    minWidth: 992,
    maxWidth: 1199
  },
  "screen-xl": {
    minWidth: 1200,
    maxWidth: 1599
  },
  "screen-xxl": {
    minWidth: 1600
  }
};

class BasicLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.getBreadcrumbNameMap = memoizeOne(this.getBreadcrumbNameMap, isEqual);
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
    this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
  }

  state = {
    rendering: true,
    isMobile: false,
    auth: localStorage.getItem("auth")
      ? JSON.parse(localStorage.getItem("auth"))
      : { roleId: "", list: [] }
  };

  getChildren = list => {
    let arr = [];
    if (!list) return;
    list.forEach(ele => {
      arr.push({
        label: ele.fullname,
        value: ele.id,
        children: this.getChildren(ele.subDept)
      });
    });
    return arr;
  };
  getRoleChildren = list => {
    let arr = [];
    if (!list) return;
    list.forEach(ele => {
      arr.push({
        title: ele.roleName,
        value: ele.roleId,
        key: ele.roleId,
        children: this.getRoleChildren(ele.subRole)
      });
    });
    return arr;
  };

  componentDidMount() {
    if (cookie.load("isPingtai")) {
      // 单点登陆时只能设置cookie ， 转化成localstorage
      localStorage.setItem("isPingtai", cookie.load("isPingtai"));
      cookie.remove("isPingtai");
    }

    const { dispatch } = this.props;
    const { auth } = this.state;

    dispatch({
      type: "currentUser/fetchCurrent"
    });

    if (!localStorage.getItem('areaTree')) {
      dispatch({
        type: "global/areaTree",
        callback: res => {
          if (res.meta && res.meta.code == 200) {
            let areaTree = [],cascaderAreas=[];
            res.data.data.forEach(ele => {
              areaTree.push({
                label: ele.fullname,
                value: ele.id,
                children: this.getChildren(ele.subDept)
              });
            });
            localStorage.setItem('areaTree', JSON.stringify(areaTree[0].children));
          }
        }
      });
    }

    if (!localStorage.getItem("roleTree")) {
      dispatch({
        type: "global/roleTree",
        callback: res => {
          let roleTree = [];
          res.data.data.forEach(ele => {
            roleTree.push({
              title: ele.roleName,
              value: ele.roleId,
              key: ele.roleId,
              children: this.getRoleChildren(ele.subRole)
            });
          });
          localStorage.setItem("roleTree", JSON.stringify(roleTree));
        }
      });
    }

    if(!localStorage.getItem("allProject")) {
      dispatch({
        type: "global/allProject",
        callback: res => {
          if(res.code == 200){
            localStorage.setItem("allProject", JSON.stringify(res.data.list));
          }
        }
      });
    }

    // 获取菜单权限
    if(localStorage.getItem('auth') && localStorage.getItem('roleId') == JSON.parse(localStorage.getItem('auth')).roleId)
    {
      this.setState({
        auth:JSON.parse(localStorage.getItem('auth'))
      })
    }
    else if(localStorage.getItem('roleId')){
      dispatch({
        type: "global/authTree",
        payload:localStorage.getItem('roleId'),
        callback: res => {
          let auth = []
          const getAuth = (arr) => {
            arr.forEach((ele,i) => {
              if(ele.hasMenu){
                auth.push(ele.menuUrl)
              }
              if(ele.subMenu){
                getAuth(ele.subMenu)

                // 如果有子集菜单权限，就给父级菜单权限
                for(let i=0;i<ele.subMenu.length;i++){
                  if(ele.subMenu[i].hasMenu){
                    auth.push(ele.menuUrl);
                    break;
                  }
                }

              }
            })
          }
          getAuth(res.data.data)

          let obj = {
            roleId:localStorage.getItem('roleId'),
            list:auth
          }
          this.setState({
            auth:obj
          })
          localStorage.setItem('auth',JSON.stringify(obj))
        }
      });
    }

    dispatch({
      type: "setting/getSetting"
    });
    this.renderRef = requestAnimationFrame(() => {
      this.setState({
        rendering: false
      });
    });
    this.enquireHandler = enquireScreen(mobile => {
      const { isMobile } = this.state;
      if (isMobile !== mobile) {
        this.setState({
          isMobile: mobile
        });
      }
    });
  }

  componentDidUpdate(preProps) {
    // After changing to phone mode,
    // if collapsed is true, you need to click twice to display
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
    const { isMobile } = this.state;
    const { collapsed } = this.props;
    if (isMobile && !preProps.isMobile && !collapsed) {
      this.handleMenuCollapse(false);
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.renderRef);
    unenquireScreen(this.enquireHandler);
  }

  getContext() {
    const { location } = this.props;
    return {
      location,
      breadcrumbNameMap: this.breadcrumbNameMap
    };
  }

  getMenuData(a) {
    let {
      route: { routes }
    } = this.props;

    // 业务菜单和平台管理菜单切换 1业务菜单 2平台管理菜单
    if (a == 2) {
      if (!routes[0].hideInMenu) {
        routes.forEach(ele => {
          if (ele.hideInMenu !== undefined) {
            ele.hideInMenu = !ele.hideInMenu;
          }
          if (ele.name == "exception") {
            ele.hideInMenu = true;
          }
        });
      }
    } else if (a == 1) {
      if (routes[0].hideInMenu) {
        routes.forEach(ele => {
          if (ele.hideInMenu !== undefined) {
            ele.hideInMenu = !ele.hideInMenu;
          }
          if (ele.name == "exception") {
            ele.hideInMenu = true;
          }
        });
      }
    }

    // 菜单权限生成
    console.log(this.state.auth)
    routes.forEach(ele => {
      if (ele.name != "exception") {
        for (let i = 0; i < this.state.auth.list.length; i++) {
          if (this.state.auth.list[i] == ele.path) {
            ele.authority = localStorage.getItem("roleId");
            break;
          } else {
            ele.authority = "superpaoba";
          }
        }
        // 子集
        if (ele.routes) {
          ele.routes.forEach(item => {
            for (let i = 0; i < this.state.auth.list.length; i++) {
              if (this.state.auth.list[i] == item.path) {
                item.authority = localStorage.getItem("roleId");
                ele.authority = localStorage.getItem("roleId"); // 如果子集有权限，则父级有权限
                break;
              } else {
                item.authority = "superpaoba";
              }
            }
          });
        }
      }
    });
    console.log(routes)
    // console.log(formatter(routes))
    return formatter(routes);
  }

  changeMenu = () => {
    const isPingtai = eval(localStorage.getItem("isPingtai").toLowerCase());
    if (isPingtai) {
      localStorage.setItem("isPingtai", false);
      router.push(rc + "/home"); // 跳转页面会重新加载菜单
    } else {
      localStorage.setItem("isPingtai", true);
      router.push(rc + "/system/params");
    }
  };

  // 获取用户角色菜单权限
  getAuth = (menuData) => {
      this.props.dispatch({
        type: "global/authTree",
        payload:localStorage.getItem('roleId'),
        callback: res => {
          let auth = []
          const fn = (arr) => {
            arr.forEach((ele,i) => {
              if(ele.hasMenu){
                auth.push(ele.menuName)
              }
              if(ele.subMenu){
                fn(ele.subMenu)

                // 如果有子集菜单权限，就给父级菜单权限
                for(let i=0;i<ele.subMenu.length;i++){
                  if(ele.subMenu[i].hasMenu){
                    auth.push(ele.menuUrl);
                    break;
                  }
                }

              }
            })
          }
          fn(res.data.data)
          // console.log(auth)
        }
      });
      // console.log(menuData)
      menuData.forEach((ele,index) => {
        if(ele.name == 'repairs'){
          // menuData.splice(index, 1)
        }
      })
  }

  /**
   * 获取面包屑映射
   * @param {Object} menuData 菜单配置
   */
  getBreadcrumbNameMap() {
    const routerMap = {};
    const mergeMenuAndRouter = data => {
      data.forEach(menuItem => {
        if (menuItem.children) {
          mergeMenuAndRouter(menuItem.children);
        }
        // Reduce memory usage
        routerMap[menuItem.path] = menuItem;
      });
    };
    const isPingtai = eval(localStorage.getItem("isPingtai").toLowerCase());
    if (isPingtai) {
      mergeMenuAndRouter(this.getMenuData(2));
    } else {
      mergeMenuAndRouter(this.getMenuData(1));
    }
    return routerMap;
  }

  matchParamsPath = pathname => {
    const pathKey = Object.keys(this.breadcrumbNameMap).find(key =>
      pathToRegexp(key).test(pathname)
    );
    return this.breadcrumbNameMap[pathKey];
  };

  getPageTitle = pathname => {
    const currRouterData = this.matchParamsPath(pathname);

    if (!currRouterData) {
      return "智慧荣成";
    }
    const message = formatMessage({
      id: currRouterData.locale || currRouterData.name,
      defaultMessage: currRouterData.name
    });
    return `${message} - 智慧荣成`;
  };

  getLayoutStyle = () => {
    const { isMobile } = this.state;
    const { fixSiderbar, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== "topmenu" && !isMobile) {
      return {
        paddingLeft: collapsed ? "80px" : "210px"
      };
    }
    return null;
  };

  getContentStyle = () => {
    const { fixedHeader } = this.props;
    return {
      margin: "24px 24px 0",
      paddingTop: fixedHeader ? 50 : 0,
      position: "relative",
      display: "flex",
      flexDirection: "column"
    };
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: "global/changeLayoutCollapsed",
      payload: collapsed
    });
  };

  renderSettingDrawer() {
    // Do show SettingDrawer in production
    // unless deployed in preview.pro.ant.design as demo
    const { rendering } = this.state;
    if (
      (rendering || process.env.NODE_ENV === "production") &&
      APP_TYPE !== "site"
    ) {
      return null;
    }
    return <SettingDrawer />;
  }

  render() {
    const {
      navTheme,
      layout: PropsLayout,
      children,
      location: { pathname }
    } = this.props;
    const { isMobile } = this.state;
    const isTop = PropsLayout === "topmenu";
    // const isPingtai = eval(cookie.load('isPingtai').toLowerCase())
    const isPingtai = eval(localStorage.getItem("isPingtai").toLowerCase());
    let menuData = null;
    if (isPingtai) {
      menuData = this.getMenuData(2);
    } else {
      menuData = this.getMenuData(1);
    }
    // this.getAuth(menuData)
    const routerConfig = this.matchParamsPath(pathname);
    const layout = (
      <Layout>
        {isTop && !isMobile ? null : (
          <SiderMenu
            logo={logo}
            Authorized={Authorized}
            theme={navTheme}
            onCollapse={this.handleMenuCollapse}
            menuData={menuData}
            isMobile={isMobile}
            {...this.props}
          />
        )}
        <Layout
          className={styles.print}
          style={{
            ...this.getLayoutStyle(),
            minHeight: "100vh"
          }}
        >
          <Header
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            logo={logo}
            isMobile={isMobile}
            // isPingtai={eval(cookie.load('isPingtai').toLowerCase())}
            isPingtai={eval(localStorage.getItem("isPingtai").toLowerCase())}
            changeMenu={this.changeMenu}
            {...this.props}
          />
          <Content
            className={styles.contentPrint}
            style={this.getContentStyle()}
          >
            <Authorized
              authority={routerConfig.authority}
              noMatch={<Exception403 />}
            >
              {children}
            </Authorized>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    );
    return (
      <React.Fragment>
        <DocumentTitle title={this.getPageTitle(pathname)}>
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                <div className={classNames(params)}>{layout}</div>
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>
        {/* {this.renderSettingDrawer()} */}
      </React.Fragment>
    );
  }
}

export default connect(({ global, setting }) => ({
  collapsed: global.collapsed,
  layout: setting.layout,
  ...setting
}))(BasicLayout);
