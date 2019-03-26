import React, { Component } from "react";
import { connect } from "dva";
import { Alert, Checkbox } from "antd";
import Login from "@/components/Login";
import styles from "./Login.less";
import router from 'umi/router'

const { Tab, UserName, Password, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects["login/login"]
}))
class LoginPage extends Component {
  state = {
    type: "account"
  };

  componentDidMount() {
    if (localStorage.getItem("remember")) {
      this.setState({
        checked: true
      });
    } else {
      this.setState({
        checked: false
      });
    }
  }

  handleSubmit = (err, values) => {
    
    // localStorage.setItem("token", 'yoyoyo');
    // localStorage.setItem("identityId", 'yoyoyo');
    // localStorage.setItem("isPingtai", false);
    // localStorage.setItem("userId", 'yoyoyo');
    // localStorage.setItem("roleId", 'yoyoyo');
    // router.push('/rc')
    // return;

    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: "login/login",
        payload: {
          ...values
        },
        callback: res => {
          if (res.meta.code == 200) {
            if (this.state.checked) {
              localStorage.setItem("remember", JSON.stringify(values));
            } else {
              localStorage.removeItem("remember");
            }
          }
        }
      });
    }
  };

  renderMessage = content => (
    <Alert
      style={{ marginBottom: 24 }}
      message={content}
      type="error"
      showIcon
    />
  );

  remember = e => {
    this.setState({
      checked: e.target.checked
    });
  };

  render() {
    const { login, submitting } = this.props;
    const { type } = this.state;
    const loginBtnStyle = {
      borderRadius: "50px",
      margin: 0,
      background: "-webkit-linear-gradient(left,#3EB4F5, #217EEA)",
      background: "-o-linear-gradient(right,#3EB4F5, #217EEA)",
      background: "-moz-linear-gradient(right,#3EB4F5, #217EEA)",
      background: "linear-gradient(to right,#3EB4F5, #217EEA)"
    };
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
            if (form) {
              if (localStorage.getItem("remember")) {
                form.setFieldsValue({
                  userName: JSON.parse(localStorage.getItem("remember"))
                    .userName,
                  password: JSON.parse(localStorage.getItem("remember"))
                    .password
                });
              } else {
                form.setFieldsValue({
                  userName: "",
                  password: ""
                });
              }
            }
          }}
        >
          {/* <Tab key="account" tab=""> */}
          <div className={styles.container}>
            <div className={styles.title}>用户登陆</div>
            <UserName name="userName" placeholder="请输入账号" />
            <Password
              name="password"
              placeholder="请输入密码"
              onPressEnter={() =>
                this.loginForm.validateFields(this.handleSubmit)
              }
            />
            <Submit style={loginBtnStyle} loading={submitting}>
              登录
            </Submit>
            <Checkbox
              checked={this.state.checked}
              style={{ marginLeft: 5 }}
              onChange={this.remember}
            >
              记住密码
            </Checkbox>
          </div>
          {/* </Tab> */}
        </Login>
      </div>
    );
  }
}

export default LoginPage;
