import { useState, useEffect, useRef } from "react";

import axios from "axios";
import { Modal } from "bootstrap";
import "./assets/scss/all.scss";

function App() {
  const env = import.meta.env;
  const baseUrl = env.VITE_API_URL;
  const signInUrl = env.VITE_SIGNIN_URL;
  const putProductsUrl = env.VITE_PUT_PRODUCT;
  const loginCheckUrl = env.VITE_LOGIN_CHECK;
  const getProductsUrl = env.VITE_GET_PRODUCTS;
  const [getProducts, setGetProducts] = useState([]);
  const [loginMessage, setLoginMessage] = useState("");
  const [tempProduct, setTempProduct] = useState(null);

  const [loginStatus, setLoginStatus] = useState(null);
  const [whichButton, setWhichButton] = useState(null);
  const [newOrEditButton, setNewOrEditButton] = useState(null);
  const [token, setToken] = useState(null);
  const [postProduct, setPostProduct] = useState({
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

  const modalRef = useRef(null);
  const modalRefMethod = useRef(null);

  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  // 只在初次渲染時執行
  useEffect(() => {
    loginCheck();
    getProductsHandler();
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
    setLoginMessage("登出成功");
    setLoginStatus(false);
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
      // getProductsHandler();
    } catch (error) {
      setLoginMessage(error.response.data.message);
      setLoginStatus(false);
    }
  }

  //新增按鈕
  function newProductBtn() {
    setNewOrEditButton(true);
    modalRefMethod.current.show();
  }

  //編輯按鈕
  function putProductBtn(obj) {
    setTempProduct(obj);
    setNewOrEditButton(false);
    modalRefMethod.current.show();
  }

  //檢查登入
  async function loginCheck() {
    const myCookie = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexschool\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if (!myCookie) {
      return;
    }
    console.log(myCookie);

    setToken(myCookie);
    try {
      const config = {
        headers: { Authorization: token },
      };
      const res = await axios.post(`${baseUrl}${loginCheckUrl}`, {}, config);
      setLoginMessage(res.data.success ? "已登入" : "未登入");
      setLoginStatus(true);
      // getProductsHandler();
    } catch (error) {
      setLoginMessage(error.response.data.message);
      setLoginStatus(false);
    }
  }

  //取得產品列表
  async function getProductsHandler() {
    const res = await axios.get(`${baseUrl}${getProductsUrl}`);
    setGetProducts(res.data.products);
  }

  //寫入產品input
  function productInputHandler(e) {
    const name = e.target.name;
    setTempProduct({
      ...tempProduct,
      [name]: e.target.value,
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
      console.log(res);

      modalRefMethod.current.hide();
      // console.log(obj);
    } catch (error) {
      console.log(error);
    }
  }
  // async function newProductHandler(str) {
  //   str === true ? setNewOrEditButton(true) : setNewOrEditButton(false);
  // }

  return (
    <div className="p-5">
      <div className="container">
        <div className="mb-3 row">
          <label htmlFor="staticEmail" className="col-sm-2 col-htmlForm-label">
            username
          </label>
          <div className="col-sm-10">
            <input
              name="username"
              type="text"
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

        <div>
          <div className="row mt-5">
            <div className={loginStatus ? " col-12" : "col-6"}>
              <div className="d-flex">
                <h2 className="me-3 mb-0">產品列表</h2>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => newProductBtn()}
                >
                  新增
                </button>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>產品名稱</th>
                    <th>原價</th>
                    <th>售價</th>
                    <th>是否啟用</th>
                    <th>查看細節</th>
                  </tr>
                </thead>
                <tbody>
                  {getProducts.map((item, index) => (
                    <tr key={index}>
                      <td>{item.category}</td>
                      <td>{item.origin_price}</td>
                      <td>{item.price}</td>
                      <td>{item.is_enabled ? "已啟用" : "未啟用"}</td>
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
            <div className={!loginStatus ? "col-md-6" : "d-none"}>
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

        <div
          className="modal fade"
          ref={modalRef}
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {newOrEditButton ? "新增產品" : "編輯產品"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {tempProduct ? (
                  <form>
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">
                        產品名稱
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        value={tempProduct.title}
                        onChange={productInputHandler}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="category" className="form-label">
                        分類
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="category"
                        name="category"
                        value={tempProduct.category}
                        onChange={productInputHandler}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="origin_price" className="form-label">
                        原價
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="origin_price"
                        name="origin_price"
                        value={tempProduct.origin_price}
                        onChange={productInputHandler}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="price" className="form-label">
                        售價
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="price"
                        name="price"
                        value={tempProduct.price}
                        onChange={productInputHandler}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="unit" className="form-label">
                        單位
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="unit"
                        name="unit"
                        value={tempProduct.unit}
                        onChange={productInputHandler}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">
                        描述
                      </label>
                      <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        value={tempProduct.description}
                        onChange={productInputHandler}
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="content" className="form-label">
                        內容
                      </label>
                      <textarea
                        className="form-control"
                        id="content"
                        name="content"
                        value={tempProduct.content}
                        onChange={productInputHandler}
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="is_enabled" className="form-label">
                        是否啟用
                      </label>
                      <select
                        className="form-select"
                        id="is_enabled"
                        name="is_enabled"
                        value={tempProduct.is_enabled}
                        onChange={productInputHandler}
                      >
                        <option value="1">啟用</option>
                        <option value="0">未啟用</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="imageUrl" className="form-label">
                        主圖網址
                      </label>
                      <img
                        src={tempProduct.imageUrl}
                        className="w-100 mb-3"
                        alt="主圖"
                      />
                      <input
                        type="text"
                        className="form-control"
                        id="imageUrl"
                        name="imageUrl"
                        value={tempProduct.imageUrl}
                        onChange={productInputHandler}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="imagesUrl" className="form-label">
                        圖片網址
                      </label>
                      {tempProduct.imagesUrl.map((url, index) => (
                        <div key={index}>
                          <img className="w-50 mb-3" src={url} alt="附圖" />
                          <input
                            key={index}
                            type="text"
                            className="form-control mb-2"
                            name="imagesUrl"
                            value={url}
                            onChange={(e) => {
                              const newImagesUrl = [...tempProduct.imagesUrl];
                              newImagesUrl[index] = e.target.value;
                              setTempProduct({
                                ...tempProduct,
                                imagesUrl: newImagesUrl,
                              });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </form>
                ) : (
                  <p className="text-secondary">請選擇一個商品查看</p>
                )}

                {/* {tempProduct ? (
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
                      <p className="card-text">
                        商品內容：{tempProduct.content}
                      </p>
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
                )} */}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  取消
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    savePutProductHandler(tempProduct);
                  }}
                >
                  確定修改
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  {whichButton ? "是否有登入" : "當前登入狀態"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">{loginMessage}</div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  關閉
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="modal fade"
          id="exampleModal2"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel2"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel2">
                  Modal title
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              {/* 新增 編輯 */}
              {/* <div className="modal-body">
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
              </div> */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button type="button" className="btn btn-primary">
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
