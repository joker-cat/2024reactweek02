import axios from "axios";
import { useForm } from "react-hook-form";

function PayForm({
  shoppingCartProducts,
  setShoppingCartProducts,
  setIsScreenLoading,
}) {
  const env = import.meta.env;
  const baseUrl = env.VITE_API_URL;
  const checkoutUrl = env.VITE_POST_CHECKOUT;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const checkout = async (checkdata) => {
    setIsScreenLoading(true);
    const resCheckout = await axios.post(`${baseUrl}${checkoutUrl}`, checkdata);
    if (resCheckout.data.success) {
      setShoppingCartProducts([]);
      reset();
      setIsScreenLoading(false);
      alert("訂單送出成功");
    }
  };

  const formSubmit = handleSubmit((data) => {
    const { message, ...user } = data;
    const checkdata = {
      data: {
        message,
        user,
      },
    };
    checkout(checkdata);
  });

  return (
    <>
      <div className="my-5 row justify-content-center">
        <form className="col-md-6" onSubmit={formSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="請輸入 Email"
              {...register("email", {
                required: "Email必填",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Email格式不正確",
                },
              })}
            />

            {errors.email && (
              <p className="text-danger my-2">{errors.email.message}</p>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              收件人姓名
            </label>
            <input
              {...register("name", {
                required: "姓名必填",
              })}
              id="name"
              className="form-control"
              placeholder="請輸入姓名"
            />

            {errors.name && (
              <p className="text-danger my-2">{errors.name.message}</p>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="tel" className="form-label">
              收件人電話
            </label>
            <input
              {...register("tel", {
                required: "電話必填",
                pattern: {
                  value: /^(0[2-8]\d{8}|09\d{8})$/,
                  message: "電話格式不正確",
                },
              })}
              id="tel"
              type="text"
              className="form-control"
              placeholder="請輸入電話"
            />

            {errors.tel && (
              <p className="text-danger my-2">{errors.tel.message}</p>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              收件人地址
            </label>
            <input
              {...register("address", {
                required: "收件人地址必填",
              })}
              id="address"
              type="text"
              className="form-control"
              placeholder="請輸入地址"
            />

            {errors.address && (
              <p className="text-danger my-2">{errors.address.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              留言
            </label>
            <textarea
              {...register("message")}
              id="message"
              className="form-control"
              cols="30"
              rows="10"
            ></textarea>
          </div>
          <div className="text-end">
            <button
              type="submit"
              className="btn btn-danger"
              disabled={shoppingCartProducts.length === 0}
            >
              送出訂單
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default PayForm;
