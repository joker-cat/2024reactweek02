function NewOrEditModal({
  modalRef,
  newOrEditButton,
  tempProduct,
  productInputHandler,
  savePostProductHandler,
  savePutProductHandler,
  setTempProduct
}) {
  return (
    <div className="modal fade" ref={modalRef} tabIndex="-1" aria-hidden="true">
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
                    min="0"
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
                    min="0"
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
                  {tempProduct.imageUrl && (
                    <img
                      src={tempProduct.imageUrl}
                      className="w-100 mb-3"
                      alt="主圖"
                    />
                  )}
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
                  <label htmlFor="imagesUrl" className="form-label d-block">
                    圖片網址
                  </label>
                  {tempProduct.imagesUrl.length === 0 ? (
                    <>
                      {tempProduct.imagesUrl || (
                        <img
                          className="w-50 mb-3"
                          src={tempProduct.imagesUrl}
                          alt="附圖"
                        />
                      )}
                      <input
                        type="text"
                        className="form-control mb-2"
                        name="imagesUrl"
                        value=""
                        onChange={(e) => {
                          setTempProduct({
                            ...tempProduct,
                            imagesUrl: [e.target.value],
                          });
                        }}
                      />
                    </>
                  ) : (
                    tempProduct.imagesUrl.map((url, index) => (
                      <div key={index}>
                        <img className="w-50 mb-3" src={url} alt="附圖" />
                        <input
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
                    ))
                  )}
                </div>
              </form>
            ) : (
              <p className="text-secondary">請選擇一個商品查看</p>
            )}
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
                newOrEditButton
                  ? savePostProductHandler()
                  : savePutProductHandler(tempProduct);
              }}
            >
              {newOrEditButton ? "確定新增" : "確定修改"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewOrEditModal;
