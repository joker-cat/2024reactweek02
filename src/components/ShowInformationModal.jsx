function ShowInformationModal({
  loginStatus,
  tempProduct,
  postToCart,
  modalInformation,
  closeShow,
  count,
  setCount,
}) {
  return (
    <>
      <div className="modal" tabIndex="-1" ref={modalInformation}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              {/* <h5 className="modal-title">Modal title</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> */}
            </div>
            <div className="modal-body">
              <div className={!loginStatus ? "col" : "d-none"}>
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
                      <p className="card-text">
                        商品內容：{tempProduct.content}
                      </p>
                      <div className="d-flex mb-3">
                        <p className="card-text text-secondary">
                          <del>{tempProduct.origin_price}</del>
                        </p>
                        元 / {tempProduct.price} 元
                      </div>
                      <div className="d-flex mb-3">
                        <select
                          className="me-2 p-2 flex-grow-1"
                          name="productcount"
                          id="productcount"
                          onChange={(e) => setCount(e.target.value - 0)}
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => postToCart(tempProduct.id, count)}
                        >
                          加入購物車
                        </button>
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
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => closeShow()}
              >
                關閉
              </button>
              {/* <button type="button" className="btn btn-primary">Save changes</button> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default ShowInformationModal;
