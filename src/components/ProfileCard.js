import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { Form, Input, Button, Spin } from "antd";
import { logoutFromFirebase, updateUserInfo, getOrderId } from "../actions";
import { StoreContext } from "../store";
import { LoadingOutlined } from "@ant-design/icons";


const ProfileCard = () => {
  const {
    state: {
      userSignin: { userInfo },
      orderDetailByUid: { loading , order , tapOrNot}
    },
    dispatch,
  } = useContext(StoreContext);
  const { displayName, email } = userInfo;
  const history = useHistory();
  const [form] = Form.useForm();

  const handleUpdate = (values) => {
    console.log(values)
    updateUserInfo(dispatch, values);
  };

  const handleLogout = () => {
    logoutFromFirebase(dispatch);
    history.push("/");
  };
  const checkOrderList = () => {
    console.log(order);
    getOrderId(dispatch);
  };
  const antIcon = <LoadingOutlined style={{ fontSize:80, color:"#8183FF"}} spin/>
  return (
    <div>
    <Form
      onFinish={handleUpdate}
      name="normal_login"
      className="login-form"
      form={form}
      initialValues={userInfo}
    >
      <Form.Item
        label="name: "
        name="name"
        rules={[
          {
            type: "string",
            message: "The input is not valid name!",
          },
          {
            message: "Please input your name!",
          },
        ]}
        hasFeedback
      >
        <Input placeholder={displayName} />
      </Form.Item>
      <Form.Item
        label="email: "
        name="email"
        rules={[
          {
            type: "email",
            message: "The input is not valid E-mail!",
          },
          {
            message: "Please input your E-mail!",
          },
        ]}
        hasFeedback
      >
        <Input placeholder={email} />
      </Form.Item>
      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            message: "Please input your password!",
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="rePassword"
        label="Re-enter Password"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            message: "Please re-enter your password!",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }

              return Promise.reject(
                new Error("The two passwords that you entered do not match!")
              );
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
      <Button
          type="dashed"
          className="login-form__button"
          onClick={checkOrderList}
        >
          Check out your order list
        </Button>

        <Button
          type="primary"
          style={{ marginTop: "0.8rem" }}
          htmlType="submit"
          className="login-form__button"
        >
          Submit
        </Button>

        <Button
          type="danger"
          style={{ marginTop: "0.8rem" }}
          className="login-form__button"
          onClick={handleLogout}
        >
          Log out
        </Button>
      </Form.Item>
    </Form>
    <div>
     { tapOrNot?( loading 
      ? (
        <div>
          <Spin indicator={antIcon} className="spinner" />
        </div>
      ) : (
        order.length===0?(
          <div>
            <p>None</p>
          </div>
        ):(
          order.map( order=>{
            return(
              <Link to={`/order/${order.id}`}>
                <Button
                  type="dashed"
                  style={{ margin: "3rem" }}
                  ghost
                >
                  Order Id: {order.id}
                </Button>
              </Link>
            )
          })
        )
      )
      ):(<div></div>)}

    </div>
    

  </div>
    
  );
};
export default ProfileCard;
