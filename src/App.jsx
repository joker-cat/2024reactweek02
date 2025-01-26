import { useState, useEffect, useRef } from "react";

import axios from "axios";
import { Modal } from "bootstrap";
import Pagunation from "./components/Pagunation";
import NewOrEditModal from "./components/NewOrEditModal";
import DeleteModal from "./components/DeleteModal";
import IsSigninModal from "./components/IsSigninModal";
import "./assets/scss/all.scss";

const env = import.meta.env;
const baseUrl = env.VITE_API_URL;
const signInUrl = env.VITE_SIGNIN_URL;
const putProductsUrl = env.VITE_PUT_PRODUCT;
const loginCheckUrl = env.VITE_LOGIN_CHECK;
const getPageProductsUrl = env.VITE_GET_PAGEPRODUCTS;
const postAdminProductsUrl = env.VITE_ADMIN_POST_PRODUCT;
const getAdminPageProductsUrl = env.VITE_ADMIN_GET_PAGEPRODUCT;

function App() {
  const [getProducts, setGetProducts] = useState([]); //管理員or使用者 產品列表
  const [loginMessage, setLoginMessage] = useState(""); //登入訊息
  const [tempProduct, setTempProduct] = useState(null); //暫存產品
  const [deleteProduct, setDeleteProduct] = useState({}); //刪除產品id
  const [loginStatus, setLoginStatus] = useState(false); //登入狀態
  const [whichButton, setWhichButton] = useState(false); //登入or登出
  const [newOrEditButton, setNewOrEditButton] = useState(false); //新增or編輯
  const [token, setToken] = useState(null); //token
  const [pageinfo, setpageinfo] = useState({});
  const modalRef = useRef(null);
  const modalRefMethod = useRef(null);

  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    (async () => {
      await checkCookie();
    })();
  }, []);

  useEffect(() => {
    modalRefMethod.current = new Modal(modalRef.current);
    modalRef.current.addEventListener("hide.bs.modal", () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });
  }, []);

  //寫入input
  function inputHandler(e) {
    const name = e.target.name;
    setUser({
      ...user,
      [name]: e.target.value,
    });
  }

  //登出
  function signOutHandler() {
    document.cookie = "hexschool=; max-age=0; path=/;";
    getProductsHandler();
    setLoginMessage("已登出");
    setLoginStatus(false);
    setTempProduct(null);
  }

  //登入
  async function loginHandler() {
    setWhichButton(true);
    try {
      const res = await axios.post(`${baseUrl}${signInUrl}`, user);
      const token = res.data.token;
      document.cookie = `hexschool=${token}; path=/;`;
      setToken(token);

      setLoginMessage(res.data.message);
      setLoginStatus(true);
      getAdminProductsHandler();
    } catch (error) {
      setLoginMessage(error.response.data.message);
      setLoginStatus(false);
    }
  }

  //新增按鈕
  function newProductBtn() {
    setNewOrEditButton(true);
    setTempProduct({
      title: "",
      category: "",
      origin_price: 0,
      price: 0,
      unit: "",
      description: "",
      content: "",
      is_enabled: 0,
      imageUrl: "",
      imagesUrl: [],
    });
    modalRefMethod.current.show();
  }

  //編輯按鈕
  function putProductBtn(obj) {
    setTempProduct(obj);
    setNewOrEditButton(false);
    modalRefMethod.current.show();
  }

  //檢查cookie
  function checkCookie() {
    const myCookie = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexschool\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if (myCookie === "") return getProductsHandler();
    setToken(myCookie);
    setLoginStatus(true);
    getAdminProductsHandler();
  }

  //取得使用者產品列表
  async function getProductsHandler(page = 1) {
    try {
      const res = await axios.get(
        `${baseUrl}${getPageProductsUrl}?page=${page}`
      );
      const products = res.data.products;
      setGetProducts(products);
      setpageinfo(res.data.pagination);
    } catch (error) {
      console.log(error);
    }
  }

  //取得管理員產品列表
  async function getAdminProductsHandler(page = 1) {
    try {
      const cookie = document.cookie.replace(
        /(?:(?:^|.*;\s*)hexschool\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      const res = await axios.get(
        `${baseUrl}${getAdminPageProductsUrl}?page=${page}`,
        {
          headers: { Authorization: cookie },
        }
      );
      const products = res.data.products;
      const turnArray = Object.keys(products).map((key) => {
        return { ...products[key] };
      });
      setGetProducts(turnArray);

      setpageinfo(res.data.pagination);
    } catch (error) {
      console.log(error);
    }
  }

  //檢查登入
  async function loginCheck() {
    const cookie = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexschool\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    const config = {
      headers: { Authorization: cookie },
    };
    try {
      const checkRes = await axios.post(
        `${baseUrl}${loginCheckUrl}`,
        {},
        config
      );
      if (checkRes.data.success === true) {
        setLoginMessage("已登入");
      }
    } catch (error) {
      setLoginMessage(error.response.data.message);
    }

  }

  //刪除
  async function deleteProductHandler(id) {
    try {
      const res = await axios.delete(`${baseUrl}${putProductsUrl}/${id}`, {
        headers: { Authorization: token },
      });
      if (res.data.success) {
        getAdminProductsHandler();
      }
      modalRefMethod.current.hide();
    } catch (error) {
      console.log(error);
    }
  }

  //寫入產品input
  function productInputHandler(e) {
    const name = e.target.name;
    const turnType =
      name === "origin_price" || name === "price" || name === "is_enabled"
        ? (e.target.value = Number(e.target.value))
        : e.target.value;

    setTempProduct({
      ...tempProduct,
      [name]: turnType,
    });
  }

  //修改產品
  async function savePutProductHandler(obj) {
    try {
      const res = await axios.put(
        `${baseUrl}${putProductsUrl}/${obj.id}`,
        {
          data: { ...obj },
        },
        {
          headers: { Authorization: token },
        }
      );

      if (res.data.success) {
        getAdminProductsHandler();
      }
      modalRefMethod.current.hide();
    } catch (error) {
      alert(error.response.data.message.join(","));
    }
  }

  //新增產品
  async function savePostProductHandler() {
    try {
      const res = await axios.post(
        `${baseUrl}${postAdminProductsUrl}`,
        {
          data: { ...tempProduct },
        },
        {
          headers: { Authorization: token },
        }
      );

      if (res.data.success) {
        getAdminProductsHandler();
      }
      modalRefMethod.current.hide();
    } catch (error) {
      alert(error.response.data.message.join(","));
    }
  }

  return (
    <div className="p-5">
      <div className="container">
        <form action="">
          <div className="mb-3 row">
            <label
              htmlFor="staticEmail"
              className="col-sm-2 col-htmlForm-label"
            >
              username
            </label>
            <div className="col-sm-10">
              <input
                name="username"
                type="email"
                className="htmlForm-control-plaintext"
                id="staticEmail"
                onChange={inputHandler}
                disabled={loginStatus}
              />
            </div>
          </div>
          <div className="mb-3 row">
            <label
              htmlFor="inputPassword"
              className="col-sm-2 col-htmlForm-label"
            >
              Password
            </label>
            <div className="col-sm-10">
              <input
                name="password"
                type="password"
                className="htmlForm-control"
                id="inputPassword"
                onChange={inputHandler}
                disabled={loginStatus}
              />
            </div>
          </div>
          <button
            type="button"
            className="btn btn-primary me-2"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            onClick={loginStatus ? signOutHandler : loginHandler}
          >
            {loginStatus ? "登出" : "登入"}
          </button>
          <button
            type="button"
            className="btn btn-danger"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            onClick={loginCheck}
          >
            檢查是否登入
          </button>
        </form>

        {/* 產品列表 */}
        <div>
          <div className="row mt-5">
            <div className={loginStatus ? " col-12" : "col-8"}>
              <div className="d-flex">
                <h2 className="me-3 mb-0">產品列表</h2>
                {loginStatus && (
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => newProductBtn()}
                  >
                    新增
                  </button>
                )}
              </div>
              <table className="table align-middle ">
                <thead>
                  <tr>
                    <th style={{ width: "40%" }}>產品名稱</th>
                    <th style={{ width: "15%" }}>原價</th>
                    <th style={{ width: "15%" }}>售價</th>
                    <th style={{ width: "10%" }}>是否啟用</th>
                    <th style={{ width: "20%" }}>查看細節</th>
                  </tr>
                </thead>
                <tbody>
                  {getProducts.map((item) => (
                    <tr
                      key={item.id}
                      className={Number(item.is_enabled) ? "table-active" : ""}
                    >
                      <td>
                        <img
                          src={item.imageUrl}
                          alt="商品圖片"
                          className="w-25 me-3"
                        />
                        <span>{item.title}</span>
                      </td>
                      <td>{item.origin_price}</td>
                      <td>{item.price}</td>
                      <td>{Number(item.is_enabled) ? "已啟用" : "未啟用"}</td>
                      <td>
                        <button
                          className="btn btn-warning me-2"
                          type="button"
                          onClick={() =>
                            !loginStatus
                              ? setTempProduct(item)
                              : putProductBtn(item)
                          }
                        >
                          {!loginStatus ? "查看細節" : "編輯"}
                        </button>
                        {loginStatus ? (
                          <button
                            type="button"
                            className={
                              loginStatus
                                ? "btn btn-danger"
                                : "btn btn-danger d-none"
                            }
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal2"
                            onClick={() =>
                              setDeleteProduct({
                                id: item.id,
                                title: item.title,
                              })
                            }
                          >
                            刪除
                          </button>
                        ) : (
                          <div></div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={!loginStatus ? "col-4" : "d-none"}>
              <h2>單一產品細節</h2>
              {tempProduct ? ( //判斷是否有選擇商品
                // 有就顯示選擇的商品
                <div className="card mb-3">
                  <img
                    src={tempProduct.imageUrl}
                    className="card-img-top primary-image"
                    alt="主圖"
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      {tempProduct.title}
                      <span className="badge bg-primary ms-2">{}</span>
                    </h5>
                    <p className="card-text">
                      商品描述：{tempProduct.description}
                    </p>
                    <p className="card-text">商品內容：{tempProduct.content}</p>
                    <div className="d-flex">
                      <p className="card-text text-secondary">
                        <del>{tempProduct.origin_price}</del>
                      </p>
                      元 / {tempProduct.price} 元
                    </div>
                    <h5 className="mt-3">更多圖片：</h5>
                    <div className="d-flex flex-wrap">
                      {tempProduct.imagesUrl.map((image, index) => (
                        <img className="w-50 p-2" key={index} src={image} />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // 沒有就顯示"請選擇一個商品查看"
                <p className="text-secondary">請選擇一個商品查看</p>
              )}
            </div>
          </div>
        </div>

        <Pagunation
          pageinfo={pageinfo}
          getAdminProductsHandler={getAdminProductsHandler}
          getProductsHandler={getProductsHandler}
          loginStatus={loginStatus}
        />
        <NewOrEditModal
          modalRef={modalRef}
          newOrEditButton={newOrEditButton}
          tempProduct={tempProduct}
          productInputHandler={productInputHandler}
          savePostProductHandler={savePostProductHandler}
          savePutProductHandler={savePutProductHandler}
          setTempProduct={setTempProduct}
        />

        <IsSigninModal whichButton={whichButton} loginMessage={loginMessage} />

        <DeleteModal
          deleteProduct={deleteProduct}
          deleteProductHandler={deleteProductHandler}
        />
      </div>
    </div>
  );
}

export default App;
