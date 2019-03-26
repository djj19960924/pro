import { rc } from "../src/global";
export default [
  // 大数据分析
  {
    path: rc + "/Analysis",
    component: "../layouts/Analysis",
  },
  // user
  {
    path: rc + "/user",
    component: "../layouts/UserLayout",
    routes: [
      // { path: '/', redirect: rc + '/home' },
      { path: "/", redirect: rc + "/user/login" },
      { path: rc + "/user", redirect: rc + "/user/login" },
      { path: rc + "/user/login", component: "./User/Login" }
    ]
  },
  // ...
  {
    path: rc,
    component: "../layouts/BasicLayout",
    Routes: ["src/pages/Authorized"],
    // authority: ["communityManage", "user"],
    // authority: ["admin", "user"],
    routes: [
      { path: rc, redirect: rc + "/home" },
      // 主页
      {
        path: rc + "/home",
        name: "home",
        icon: "home",
        component: "./home/home",
        hideInMenu: false
      },

      // 平台管理
      {
        // 系统基础信息
        path: rc + "/system/params",
        name: "system.params",
        icon: "laptop",
        component: "./system/params/index",
        hideChildrenInMenu: true,
        hideInMenu: true
      },
      {
        // 系统信息维护
        path: rc + "/system/sysInfo",
        name: "system.sysInfo",
        icon: "setting",
        component: "./system/sysInfo/index",
        hideChildrenInMenu: true,
        hideInMenu: true
      },
      {
        // 菜单管理
        path: rc + "/system/menu",
        name: "system.menu",
        icon: "bars",
        component: "./system/menu/index", 
        hideChildrenInMenu: true,
        hideInMenu: true,
        routes: [
          {
            path: rc + "/system/menu",
            redirect: rc + "/system/menu/list"
          },
          {
            path: rc + "/system/menu/list",
            component: "./system/menu/list"
          }
        ]
      },
      {
        // 区域管理
        path: rc + "/system/area",
        name: "system.area",
        icon: "environment",
        component: "./system/area/index",
        hideChildrenInMenu: true,
        hideInMenu: true,
        routes: [
          {
            path: rc + "/system/area",
            redirect: rc + "/system/area/list"
          },
          {
            path: rc + "/system/area/list",
            component: "./system/area/list"
          }
        ]
      },
      {
        // 角色权限管理
        path: rc + "/system/role",
        name: "system.role",
        icon: "key",
        component: "./system/role/index",
        hideChildrenInMenu: true,
        hideInMenu: true,
        routes: [
          {
            path: rc + "/system/role",
            redirect: rc + "/system/role/list"
          },
          {
            path: rc + "/system/role/list",
            component: "./system/role/list"
          }
        ]
      },
      {
        // 用户管理
        path: rc + "/system/user",
        name: "system.user",
        icon: "usergroup-add",
        component: "./system/user/index",
        hideChildrenInMenu: true,
        hideInMenu: true,
        routes: [
          {
            path: rc + "/system/user",
            redirect: rc + "/system/user/list"
          },
          {
            path: rc + "/system/user/list",
            component: "./system/user/list"
          }
        ]
      },
      {
        // 用户管理
        path: rc + "/system/wxUser",
        name: "system.wxUser",
        icon: "wechat",
        component: "./system/wxUser/index",
        hideChildrenInMenu: true,
        hideInMenu: true,
        routes: [
          {
            path: rc + "/system/wxUser",
            redirect: rc + "/system/wxUser/data"
          },
          {
            path: rc + "/system/wxUser/data",
            component: "./system/wxUser/data"
          }
        ]
      },
      {
        // 体测点管理
        path: rc + "/system/ticePoint",
        name: "system.ticePoint",
        icon: "flag",
        component: "./system/ticePoint/index",
        hideChildrenInMenu: true,
        hideInMenu: true,
        routes: [
          {
            path: rc + "/system/ticePoint",
            redirect: rc + "/system/ticePoint/point"
          },
          {
            path: rc + "/system/ticePoint/point",
            component: "./system/ticePoint/point"
          }
        ]
      },
      {
        // 体测管理
        path: rc + "/system/tice",
        name: "system.tice",
        icon: "rocket",
        hideInMenu: true,
        // component: './system/tice',
        routes: [
          {
            path: rc + "/system/tice/tizhi",
            component: "./system/tice/tizhi",
            name: "tizhi"
          },
          {
            path: rc + "/system/tice/shebei",
            component: "./system/tice/shebei",
            name: "shebei"
          }
        ]
      },

      // 体测数据
      {
        path: rc + "/tice",
        name: "tice",
        icon: "fire",
        hideInMenu: false,
        // authority:'',
        routes: [
          {
            path: rc + "/tice/one",
            name: "tice_one",
            component: "./tice/tice_one/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/tice/one",
                redirect: rc + "/tice/one/data"
              },
              {
                path: rc + "/tice/one/data",
                component: "./tice/tice_one/data"
              }
            ]
          },
          {
            path: rc + "/tice/all",
            name: "tice_all",
            component: "./tice/tice_all/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/tice/all",
                redirect: rc + "/tice/all/data"
              },
              {
                path: rc + "/tice/all/data",
                component: "./tice/tice_all/data"
              },
              {
                path: rc + "/tice/all/moreData",
                name: "personReportRecord",
                component: "./tice/tice_all/moreData"
              },
              {
                path: rc + "/tice/all/report",
                name: "report",
                component: "./tice/tice_all/report"
              },
              {
                path: rc + "/tice/all/chufang",
                name: "chufang",
                component: "./tice/chufang/chufang",
                hideInMenu:true
              },
            ]
          },
          
          {
            path: rc + "/tice/equipment",
            name: "tice_equipment",
            component: "./tice/equipment/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/tice/equipment",
                redirect: rc + "/tice/equipment/point"
              },
              {
                path: rc + "/tice/equipment/point",
                component: "./tice/equipment/point"
              },
              {
                path: rc + "/tice/equipment/device",
                name: "device",
                component: "./tice/equipment/device"
              },
              {
                path: rc + "/tice/equipment/record",
                name: "record",
                component: "./tice/equipment/record"
              }
            ]
          },
          {
            path: rc + "/tice/point",
            name: "tice_point",
            component: "./tice/point/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/tice/point",
                redirect: rc + "/tice/point/point"
              },
              {
                path: rc + "/tice/point/point",
                component: "./tice/point/data"
              },
              {
                path: rc + "/tice/point/detail",
                component: "./tice/point/ticeDetail"
              },
            ]
          },
          {
            path: rc + "/tice/weidu",
            name: "tice_weidu",
            component: "./tice/weidu/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/tice/weidu",
                redirect: rc + "/tice/weidu/weidu"
              },
              {
                path: rc + "/tice/weidu/weidu",
                component: "./tice/weidu/data"
              },
            ]
          },
          {
            path: rc + "/tice/charts",
            name: "charts",
            component: "./tice/charts/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/tice/charts",
                redirect: rc + "/tice/charts/index"
              },
              {
                path: rc + "/tice/charts/index",
                component: "./tice/charts/index"
              }
            ]
          },
        ]
      },

      // 运动干预
      {
        path: rc + "/sport",
        name: "sport",
        icon: "alert",
        hideInMenu: false,
        routes: [
          {
            path: rc + "/sport/sportData",
            name: "sportData",
            component: "./sport/sportData/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/sport/sportData",
                redirect: rc + "/sport/sportData/data"
              },
              {
                path: rc + "/sport/sportData/data",
                component: "./sport/sportData/data"
              }
            ]
          },
          {
            path: rc + "/sport/sportTarget",
            name: "sportTarget",
            component: "./sport/sportTarget/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/sport/sportTarget",
                redirect: rc + "/sport/sportTarget/data"
              },
              {
                path: rc + "/sport/sportTarget/data",
                component: "./sport/sportTarget/data"
              }
            ]
          },
          {
            path: rc + "/sport/bracelet",
            name: "bracelet",
            component: "./sport/bracelet/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/sport/bracelet",
                redirect: rc + "/sport/bracelet/data"
              },
              {
                path: rc + "/sport/bracelet/data",
                component: "./sport/bracelet/data"
              }
            ]
          },
        ]
      },
      // 运动资讯
      {
        path: rc + "/ydzx",
        name: "news002",
        icon: "hourglass",
        hideInMenu: false,
        routes: [
          {
            path: rc + "/ydzx/index",
            name: "list",
            component: "./news002/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/ydzx/index",
                redirect: rc + "/ydzx/index/list"
              },
              {
                path: rc + "/ydzx/index/list",
                component: "./news002/list"
              },
            ]
          },
          {
            path: rc + "/ydzx/add",
            name: "add",
            component: "./news002/add",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/ydzx/add",
                redirect: rc + "/ydzx/add/index"
              },
              {
                path: rc + "/ydzx/add/index",
                component: "./news002/add"
              },
            ]
          },
        ]
      },

      // 科学健身指导
      {
        path: rc + "/guide",
        name: "guide",
        icon: "bulb",
        hideInMenu: false,
        routes: [
          {
            path: rc + "/guide/expertServiceType",
            name: "expertServiceType",
            component: "./guide/expertServiceType/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/guide/expertServiceType",
                redirect: rc + "/guide/expertServiceType/data"
              },
              {
                path: rc + "/guide/expertServiceType/data",
                component: "./guide/expertServiceType/data"
              }
            ]
          },
          {
            path: rc + "/guide/specialist",
            name: "specialist",
            component: "./guide/specialist/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/guide/specialist",
                redirect: rc + "/guide/specialist/data"
              },
              {
                path: rc + "/guide/specialist/data",
                component: "./guide/specialist/data"
              }
            ]
          },
          {
            path: rc + "/guide/wxUser",
            name: "wxUser",
            component: "./guide/wxUser/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/guide/wxUser",
                redirect: rc + "/guide/wxUser/data"
              },
              {
                path: rc + "/guide/wxUser/data",
                component: "./guide/wxUser/data"
              }
            ]
          },
          {
            path: rc + "/guide/team",
            name: "team",
            component: "./guide/team/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/guide/team",
                redirect: rc + "/guide/team/data"
              },
              {
                path: rc + "/guide/team/data",
                component: "./guide/team/data"
              },
              {
                path: rc + "/guide/team/user",
                name: "userList",
                component: "./guide/team/userList"
              },
              {
                path: rc + "/guide/team/expert",
                name: "expertList",
                component: "./guide/team/expertList"
              }
            ]
          },
          {
            path: rc + "/guide/guide",
            name: "guide",
            component: "./guide/tice_all/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/guide/guide",
                redirect: rc + "/guide/guide/data"
              },
              {
                path: rc + "/guide/guide/data",
                component: "./guide/tice_all/data"
              },
              {
                path: rc + "/guide/guide/moreData",
                name: "personReportRecord",
                component: "./guide/tice_all/moreData"
              },
              {
                path: rc + "/guide/guide/report",
                name: "report",
                component: "./guide/tice_all/report"
              },
              {
                path: rc + "/guide/guide/chufang",
                name: "chufang",
                component: "./guide/chufang/chufang"
              }
            ]
          },
          {
            path: rc + "/guide/record_team",
            name: "record_team",
            component: "./guide/record_team/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/guide/record_team",
                redirect: rc + "/guide/record_team/data"
              },
              {
                path: rc + "/guide/record_team/data",
                component: "./guide/record_team/data"
              },
              {
                path: rc + "/guide/record_team/user",
                name: "userList",
                component: "./guide/record_team/userList"
              },
              {
                path: rc + "/guide/record_team/repeat",
                name: "repeat",
                component: "./guide/record_team/repeat"
              },
              {
                path: rc + "/guide/record_team/moreData",
                name: "personReportRecord",
                component: "./guide/tice_all/moreData"
              },
            ]
          },
          {
            path: rc + "/guide/record_specialist",
            name: "record_specialist",
            component: "./guide/record_specialist/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/guide/record_specialist",
                redirect: rc + "/guide/record_specialist/data"
              },
              {
                path: rc + "/guide/record_specialist/data",
                component: "./guide/record_specialist/data"
              },
              {
                path: rc + "/guide/record_specialist/detail",
                component: "./guide/record_specialist/recordDetail"
              },
            ]
          },
          {
            path: rc + "/guide/record_personal",
            name: "record_personal",
            component: "./guide/record_personal/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/guide/record_personal",
                redirect: rc + "/guide/record_personal/data"
              },
              {
                path: rc + "/guide/record_personal/data",
                component: "./guide/record_personal/data"
              }
            ]
          },
          {
            path: rc + "/guide/lib_personal",
            name: "lib_personal",
            component: "./guide/lib_personal/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/guide/lib_personal",
                redirect: rc + "/guide/lib_personal/data"
              },
              {
                path: rc + "/guide/lib_personal/data",
                component: "./guide/lib_personal/data"
              }
            ]
          },
          {
            path: rc + "/guide/chufang",
            name: "chufang",
            component: "./guide/chufang/chufang",
            hideInMenu:true
          },
          {
            path: rc + "/guide/report",
            name: "report",
            component: "./tice/tice_all/report",
            hideInMenu:true
          }
        ]
      },
      // 线上健身知识
      {
        path: rc + "/xsjszs",
        name: "news003",
        icon: "share-alt",
        hideInMenu: false,
        routes: [
          {
            path: rc + "/xsjszs/index",
            name: "list",
            component: "./news003/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/xsjszs/index",
                redirect: rc + "/xsjszs/index/list"
              },
              {
                path: rc + "/xsjszs/index/list",
                component: "./news003/list"
              },
            ]
          },
          {
            path: rc + "/xsjszs/add",
            name: "add",
            component: "./news003/add",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/xsjszs/add",
                redirect: rc + "/xsjszs/add/index"
              },
              {
                path: rc + "/xsjszs/add/index",
                component: "./news003/add"
              },
            ]
          },
        ]
      },

      // 赛事及社团管理
      {
        path: rc + "/club",
        name: "club",
        icon: "trophy",
        hideInMenu: false,
        routes: [
          {
            path: rc + "/club/communityManage",
            name: "community_manage",
            component: "./club/communityManage/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/club/communityManage",
                redirect: rc + "/club/communityManage/list"
              },
              {
                path: rc + "/club/communityManage/list",
                component: "./club/communityManage/list"
              }
            ]
          },
          {
            path: rc + "/club/competitionManage",
            name: "competition_manage",
            component: "./club/competitionManage/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/club/competitionManage",
                redirect: rc + "/club/competitionManage/list"
              },
              {
                path: rc + "/club/competitionManage/list",
                component: "./club/competitionManage/list"
              }
            ]
          },
          {
            path: rc + "/club/competitionManageFirst",
            name: "competition_manageFirst",
            component: "./club/competitionManageFirst/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/club/competitionManageFirst",
                redirect: rc + "/club/competitionManageFirst/list"
              },
              {
                path: rc + "/club/competitionManageFirst/list",
                component: "./club/competitionManageFirst/list"
              },
              {
                path: rc + "/club/competitionManageFirst/competitionDetail",
                name:'competitionDetail',
                component: "./club/competitionManageFirst/competitionDetail"
              }
            ]
          },
          
          {
            path: rc + "/club/competitionRegistration",
            name: "competition_registration",
            component: "./club/competitionRegistration/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/club/competitionRegistration",
                redirect: rc + "/club/competitionRegistration/list"
              },
              {
                path: rc + "/club/competitionRegistration/list",
                component: "./club/competitionRegistration/list"
              }
            ]
          },
          {
            // 新增赛事
            path: rc + "/club/competitionManageRelease",
            name: "competition_manage_release",
            component: "./club/competitionManageRelease",
            hideChildrenInMenu: true,
            hideInMenu: true,
            routes: [
              {
                path: rc + "/club/competitionManageRelease",
                redirect: rc + "/club/competitionManageRelease/list"
              },
              {
                path: rc + "/club/competitionManageRelease/list",
                component: "./club/competitionManageRelease/list"
              }
            ]
          },
          {
            // 审核赛事
            path: rc + "/club/competitionManageCheck",
            name: "competition_manage_check",
            component: "./club/competitionManageCheck",
            hideChildrenInMenu: true,
            hideInMenu: true,
            routes: [
              {
                path: rc + "/club/competitionManageCheck",
                redirect: rc + "/club/competitionManageCheck/list"
              },
              {
                path: rc + "/club/competitionManageCheck/list",
                component: "./club/competitionManageCheck/list"
              }
            ]
          },
          { //赛事成绩
            path: rc + "/club/competitionGrade",
            name: "competition_grade",
            component: "./club/competitionGrade/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/club/competitionGrade",
                redirect: rc + "/club/competitionGrade/list"
              },
              {
                path: rc + "/club/competitionGrade/list",
                component: "./club/competitionGrade/list"
              },
              {
                path: rc + "/club/competitionGrade/detail",
                name:'detail',
                component: "./club/competitionGrade/detail"
              }
            ]
          },
          { //赛事活动数据统计
            path: rc + "/club/competitionHistory",
            name: "competition_History",
            component: "./club/competitionHistory/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/club/competitionHistory",
                redirect: rc + "/club/competitionHistory/list"
              },
              {
                path: rc + "/club/competitionHistory/list",
                component: "./club/competitionHistory/list"
              },
              {
                path: rc + "/club/competitionHistory/detail",
                name:'detail',
                component: "./club/competitionHistory/detail"
              }
            ]
          },
          {
            // 报名详情
            path: rc + "/club/competitionRegistrationDetail",
            name: "competition_registration_detail",
            component: "./club/competitionRegistrationDetail",
            hideChildrenInMenu: true,
            hideInMenu: true,
            routes: [
              {
                path: rc + "/club/competitionRegistrationDetail",
                redirect: rc + "/club/competitionRegistrationDetail/list"
              },
              {
                path: rc + "/club/competitionRegistrationDetail/list",
                component: "./club/competitionRegistrationDetail/list"
              }
            ]
          },
          {
            // 新闻新增
            path: rc + "/club/competitionNewsRelease",
            name: "competition_news_release",
            component: "./club/competitionNewsRelease",
            hideChildrenInMenu: true,
            hideInMenu: true,
            routes: [
              {
                path: rc + "/club/competitionNewsRelease",
                redirect: rc + "/club/competitionNewsRelease/list"
              },
              {
                path: rc + "/club/competitionNewsRelease/list",
                component: "./club/competitionNewsRelease/list"
              }
            ]
          },
          {
            // 审核新闻
            path: rc + "/club/competitionNewsCheck",
            name: "competition_news_check",
            component: "./club/competitionNewsCheck",
            hideChildrenInMenu: true,
            hideInMenu: true,
            routes: [
              {
                path: rc + "/club/competitionNewsCheck",
                redirect: rc + "/club/competitionNewsCheck/list"
              },
              {
                path: rc + "/club/competitionNewsCheck/list",
                component: "./club/competitionNewsCheck/list"
              }
            ]
          },
          {
            // 查看社团成员
            path: rc + "/club/communityDetail",
            name: "community_detail",
            component: "./club/communityDetail",
            hideChildrenInMenu: true,
            hideInMenu: true,
            routes: [
              {
                path: rc + "/club/communityDetail",
                redirect: rc + "/club/communityDetail/list"
              },
              {
                path: rc + "/club/communityDetail/list",
                component: "./club/communityDetail/list"
              }
            ]
          },
          // 赛事社团数据分析统计
          
        ]
      },
      // 精彩瞬间
      {
        path: rc + "/jcsj",
        name: "news001",
        icon: "crown",
        hideInMenu: false,
        routes: [
          {
            path: rc + "/jcsj/index",
            name: "list",
            component: "./news001/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/jcsj/index",
                redirect: rc + "/jcsj/index/list"
              },
              {
                path: rc + "/jcsj/index/list",
                component: "./news001/list"
              },
            ]
          },
          {
            path: rc + "/jcsj/add",
            name: "add",
            component: "./news001/add",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/jcsj/add",
                redirect: rc + "/jcsj/add/index"
              },
              {
                path: rc + "/jcsj/add/index",
                component: "./news001/add"
              },
            ]
          },
        ]
      },

      // 体育设施巡检
      {
        path: rc + "/repairs",
        name: "repairs",
        icon: "thunderbolt",
        hideInMenu: false,
        routes: [
          // {
          //   path: rc + "/repairs/area",
          //   name: "area",
          //   component: "./repairs/area/index",
          //   hideChildrenInMenu: true,
          //   routes: [
          //     {
          //       path: rc + "/repairs/area",
          //       redirect: rc + "/repairs/area/list"
          //     },
          //     {
          //       path: rc + "/repairs/area/list",
          //       component: "./repairs/area/list"
          //     }
          //   ]
          // },
          {
            path: rc + "/repairs/villageList",
            name: "villageList",
            component: "./repairs/villageList/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/repairs/villageList",
                redirect: rc + "/repairs/villageList/list"
              },
              {
                path: rc + "/repairs/villageList/list",
                component: "./repairs/villageList/list"
              }
            ]
          },
          {
            path: rc + "/repairs/villageMap",
            name: "villageMap",
            component: "./repairs/villageMap/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/repairs/villageMap",
                redirect: rc + "/repairs/villageMap/list"
              },
              {
                path: rc + "/repairs/villageMap/list",
                component: "./repairs/villageMap/list"
              }
            ]
          },
          {
            path: rc + "/repairs/equipmentInfo",
            name: "equipmentInfo",
            component: "./repairs/equipmentInfo/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/repairs/equipmentInfo",
                redirect: rc + "/repairs/equipmentInfo/list"
              },
              {
                path: rc + "/repairs/equipmentInfo/list",
                component: "./repairs/equipmentInfo/list"
              }
            ]
          },
          {
            path: rc + "/repairs/equipmentList",
            name: "equipmentList",
            component: "./repairs/equipmentList/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/repairs/equipmentList",
                redirect: rc + "/repairs/equipmentList/list"
              },
              {
                path: rc + "/repairs/equipmentList/list",
                component: "./repairs/equipmentList/list"
              }
            ]
          },
          {
            path: rc + "/repairs/equipmentTj",
            name: "equipmentTj",
            component: "./repairs/equipmentTj/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/repairs/equipmentTj",
                redirect: rc + "/repairs/equipmentTj/list"
              },
              {
                path: rc + "/repairs/equipmentTj/list",
                component: "./repairs/equipmentTj/list"
              },
              {
                path: rc + "/repairs/equipmentTj/detail",
                component: "./repairs/equipmentTj/detail"
              }
            ]
          },
          {
            path: rc + "/repairs/orderList",
            name: "orderList",
            component: "./repairs/orderList/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/repairs/orderList",
                redirect: rc + "/repairs/orderList/list"
              },
              {
                path: rc + "/repairs/orderList/list",
                component: "./repairs/orderList/list"
              }
            ]
          },
          {
            path: rc + "/repairs/repairMan",
            name: "repairMan",
            component: "./repairs/repairMan/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/repairs/repairMan",
                redirect: rc + "/repairs/repairMan/list"
              },
              {
                path: rc + "/repairs/repairMan/list",
                component: "./repairs/repairMan/list"
              }
            ]
          },
          // {
          //   path: rc + "/repairs/orderTj",
          //   name: "orderTj",
          //   component: "./repairs/orderTj/index",
          //   hideChildrenInMenu: true,
          //   routes: [
          //     {
          //       path: rc + "/repairs/orderTj",
          //       redirect: rc + "/repairs/orderTj/list"
          //     },
          //     {
          //       path: rc + "/repairs/orderTj/list",
          //       component: "./repairs/orderTj/list"
          //     }
          //   ]
          // },
        ]
      },

      // 体育资源管理
      {
        path: rc + "/resource",
        name: "resource",
        icon: "deployment-unit",
        hideInMenu: false,
        routes: [
          // {
          //   path: rc + "/resource/resourceType",
          //   name: "resourceType",
          //   component: "./resource/resourceType/index",
          //   hideChildrenInMenu: true,
          //   routes: [
          //     {
          //       path: rc + "/resource/resourceType",
          //       redirect: rc + "/resource/resourceType/list"
          //     },
          //     {
          //       path: rc + "/resource/resourceType/list",
          //       component: "./resource/resourceType/list"
          //     }
          //   ]
          // },
          // {
          //   path: rc + "/resource/gym",
          //   name: "gym",
          //   component: "./resource/myGym/index",
          //   hideChildrenInMenu: true,
          //   routes: [
          //     {
          //       path: rc + "/resource/gym",
          //       redirect: rc + "/resource/gym/list"
          //     },
          //     {
          //       path: rc + "/resource/gym/list",
          //       component: "./resource/myGym/list"
          //     }
          //   ]
          // },
          {
            path: rc + "/resource/resource",
            name: "resource",
            component: "./resource/resource/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/resource/resource",
                redirect: rc + "/resource/resource/list"
              },
              {
                path: rc + "/resource/resource/list",
                component: "./resource/resource/list"
              },
              {
                path: rc + "/resource/resource/coachDetail",
                name:'coachDetail',
                component: "./resource/resource/coachDetail"
              }
            ]
          },
          // {
          //   path: rc + "/resource/coach",
          //   name: "coach",
          //   component: "./resource/coach/index",
          //   hideChildrenInMenu: true,
          //   routes: [
          //     {
          //       path: rc + "/resource/coach",
          //       redirect: rc + "/resource/coach/list"
          //     },
          //     {
          //       path: rc + "/resource/coach/list",
          //       component: "./resource/coach/list"
          //     },
          //   ]
          // },
          {
            path: rc + "/resource/resourceMap",
            name: "resourceMap",
            component: "./resource/resourceMap/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/resource/resourceMap",
                redirect: rc + "/resource/resourceMap/map"
              },
              {
                path: rc + "/resource/resourceMap/map",
                component: "./resource/resourceMap/map"
              }
            ]
          },
          // {
          //   path: rc + "/resource/charts",
          //   name: "charts",
          //   component: "./resource/charts/index",
          //   hideChildrenInMenu: true,
          //   routes: [
          //     {
          //       path: rc + "/resource/charts",
          //       redirect: rc + "/resource/charts/index"
          //     },
          //     {
          //       path: rc + "/resource/charts/index",
          //       component: "./resource/charts/index"
          //     }
          //   ]
          // },
        ]
      },

      // 新闻管理
      {
        path: rc + "/news",
        name: "news",
        icon: "camera",
        hideInMenu: false,
        routes: [
          {
            path: rc + "/news/newsType",
            name: "newsType",
            component: "./news/newsType/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/news/newsType",
                redirect: rc + "/news/newsType/list"
              },
              {
                path: rc + "/news/newsType/list",
                component: "./news/newsType/list"
              }
            ]
          },
          {
            path: rc + "/news/newsList",
            name: "newsList",
            component: "./news/newsList/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/news/newsList",
                redirect: rc + "/news/newsList/list"
              },
              {
                path: rc + "/news/newsList/list",
                component: "./news/newsList/list"
              },
              {
                path: rc + "/news/newsList/add",
                component: "./news/addNews/add"
              }
            ]
          },
        ]
      },

      // 消息管理
      {
        path: rc + "/msg",
        name: "msg",
        icon: "sound",
        hideInMenu: false,
        routes: [
          {
            path: rc + "/msg/add",
            name: "add",
            component: "./msg/addMsg/add",
          },
          {
            path: rc + "/msg/add_age",
            name: "add_age",
            component: "./msg/addMsg_age/add",
          },
          {
            path: rc + "/msg/add_club",
            name: "add_club",
            component: "./msg/addMsg_club/add",
          },
          {
            path: rc + "/msg/add_game",
            name: "add_game",
            component: "./msg/addMsg_game/add",
          },
          {
            path: rc + "/msg/msgList",
            name: "msgList",
            component: "./msg/msgList/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/msg/msgList",
                redirect: rc + "/msg/msgList/list"
              },
              {
                path: rc + "/msg/msgList/list",
                component: "./msg/msgList/list"
              }
            ]
          },
        ]
      },

      // 意见反馈
      {
        path: rc + "/complaint",
        name: "complaint",
        icon: "mail",
        hideInMenu: false,
        routes: [
          {
            path: rc + "/complaint",
            name: "complaint",
            component: "./complaint/index",
            hideChildrenInMenu: true,
            routes: [
              {
                path: rc + "/complaint",
                redirect: rc + "/complaint/list"
              },
              {
                path: rc + "/complaint/list",
                component: "./complaint/list"
              }
            ]
          },
        ]
      },

      // 个人中心
      {
        path: rc + "/personal",
        name: "personal",
        icon: "user",
        component: "./personal/personal",
        hideInMenu: false
      },

      {
        // 异常
        name: "exception",
        icon: "warning",
        path: rc + "/exception",
        hideInMenu: true,
        routes: [
          {
            path: rc + "/exception/403",
            name: "not-permission",
            component: "./Exception/403"
          },
          {
            path: rc + "/exception/404",
            name: "not-find",
            component: "./Exception/404"
          },
          {
            path: rc + "/exception/500",
            name: "server-error",
            component: "./Exception/500"
          },
          {
            path: rc + "/exception/timeOut",
            name: "timeOut",
            component: "./Exception/timeOut"
          }
        ]
      }
    ]
  }
]
