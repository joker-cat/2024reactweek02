import axios from "axios";

function ShoppingCart({
  shoppingCartProducts,
  getShoppingCart,
  setShoppingCartProducts,
  setIsScreenLoading,
}) {
  const env = import.meta.env;
  const baseUrl = env.VITE_API_URL;

  const deleteProductUrl = env.VITE_DELETE_SHOPPINGCART;
  const putProductUrl = env.VITE_PUT_SHOPPINGCART;
  const clearCartUrl = env.VITE_DELETE_CLEARCART;

  // 刪除購物車商品
  async function removeProduct(id) {
    setIsScreenLoading(true);
    await axios.delete(`${baseUrl}${deleteProductUrl}/${id}`);
    const { data } = await getShoppingCart();
    setShoppingCartProducts(data.data.carts);
    setIsScreenLoading(false);
  }

  // 清空購物車
  async function clearCart() {
    setIsScreenLoading(true);
    await axios.delete(`${baseUrl}${clearCartUrl}`);
    const { data } = await getShoppingCart();
    setShoppingCartProducts(data.data.carts);
    setIsScreenLoading(false);
  }

  // 修改購物車商品數量
  async function putProduct(productObj) {
    setIsScreenLoading(true);
    await axios.put(`${baseUrl}${putProductUrl}/${productObj.id}`, {
      data: {
        product_id: productObj.id,
        qty: Number(productObj.qty),
      },
    });
    const { data } = await getShoppingCart();
    setShoppingCartProducts(data.data.carts);
    setIsScreenLoading(false);
  }

  return (
    <>
      <div className="text-end">
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => clearCart()}
        >
          清空購物車
        </button>
      </div>
      <table className="table align-middle">
        <thead>
          <tr>
            <th></th>
            <th>品名</th>
            <th style={{ width: "150px" }}>數量/單位</th>
            <th className="text-end">單項售價</th>
          </tr>
        </thead>

        <tbody>
          {shoppingCartProducts.map((product, index) => (
            <tr key={index}>
              <td>
                <button
                  onClick={() => removeProduct(product.id)}
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                >
                  x
                </button>
              </td>
              <td>{product.product.title}</td>
              <td style={{ width: "150px" }}>
                <div className="d-flex align-items-center">
                  <div className="btn-group me-2" role="group">
                    <button
                      type="button"
                      className="btn btn-outline-dark btn-sm"
                      onClick={() =>
                        putProduct(
                          Number(product.qty) === 1
                            ? product
                            : { ...product, qty: Number(product.qty) - 1 }
                        )
                      }
                    >
                      -
                    </button>
                    <span
                      className="btn border border-dark"
                      style={{ width: "50px", cursor: "auto" }}
                    >
                      {product.qty}
                    </span>
                    <button
                      type="button"
                      className="btn btn-outline-dark btn-sm"
                      onClick={() =>
                        putProduct({ ...product, qty: Number(product.qty) + 1 })
                      }
                    >
                      +
                    </button>
                  </div>
                  <span className="input-group-text bg-transparent border-0">
                    {product.product.unit}
                  </span>
                </div>
              </td>
              <td className="text-end">{product.total}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3" className="text-end">
              總計：
            </td>
            <td className="text-end" style={{ width: "130px" }}>
              {shoppingCartProducts.reduce(
                (acc, product) => acc + product.total,
                0
              )}
            </td>
          </tr>
        </tfoot>
      </table>
    </>
  );
}

export default ShoppingCart;
