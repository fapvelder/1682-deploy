import React, { useContext, useEffect, useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { Grid, Input } from "@material-ui/core";
import { Button, Checkbox, InputNumber } from "antd";
import axios from "axios";
import {
  addFundUser,
  addFundVNPay,
  approvePaypal,
  createOrderPaypal,
} from "../../../../api";
import { toast } from "react-toastify";
import { Store } from "../../../../Store";
import "./addFunds.css";
import paypalTrans from "../../../../component/img/paypaltrans.png";
import vnpayTrans from "../../../../component/img/vnpayTrans.png";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import moment from "moment";
export default function AddFund({ language, vi, en }) {
  const { state } = useContext(Store);
  const userID = state?.data?._id;
  const [value, setValue] = useState(5);
  const [paypalKey, setPaypalKey] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [order, setOrder] = useState(false);
  const [active, setActive] = useState(0);
  const [activePayment, setActivePayment] = useState(0);
  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };
  const initialOptions = {
    "client-id":
      "Ad1PYS-hNxpTe0Kq_9k6h6xwxPMIWDv24zxLojAR_oXAlfn0NjYe2mvko_8BDws_Dj4TfyMFkgmlLyf-",
    currency: "USD",
    intent: "capture",
    // "data-client-token": "abc123xyz==",
  };
  const funds = [5, 10, 25, 50, 100, 200, 300, 500, 800, 1000];
  const payments = [
    {
      name: "Paypal",
      src: paypalTrans,
    },
    { name: "VNPay", src: vnpayTrans },
  ];
  const createOrder = async () => {
    try {
      const response = await createOrderPaypal(value);
      return response?.data?.id;
    } catch (error) {
      // Handle error
      console.error(error);
    }
  };
  const handleChangeValue = (value, index) => {
    setActive(index);
    setValue(value);
    setPaypalKey((prevKey) => prevKey + 1);
  };
  const handleChangePayment = (payment, index) => {
    setActivePayment(index);
    setPaymentMethod(payment);
  };
  const onApprove = async (data) => {
    try {
      const response = await approvePaypal(data, userID);
      const paypal = response?.data?.purchase_units[0]?.payments?.captures[0];
      if (paypal.status === "COMPLETED") {
        await addFundUser(userID, paypal.amount.value);
        toast.success("Add fund successfully");
      }
    } catch (error) {
      // Handle error
      console.error(error);
    }
  };
  const handlePayment = () => {
    if (isChecked && value) {
      setOrder(true);
    }
  };
  const handleVNPay = async () => {
    const amountVNPay = value * 24000;
    const bankCode = "";
    const language = state?.language || "vn";
    const redirect = await addFundVNPay(
      userID,
      amountVNPay,
      bankCode,
      language
    );
    window.open(redirect.data, "_blank");
  };
  console.log(state);
  const transactions = state?.data?.transactions;
  return (
    <Grid container>
      {!order ? (
        <div>
          <Grid container style={{ gridGap: 10 }}>
            {funds?.map((item, index) => (
              <Grid
                item
                xs={4}
                sm={2}
                md={2}
                key={index}
                className={`funds-item ${active === index && "active"}`}
                onClick={() => {
                  handleChangeValue(item, index);
                }}
              >
                <Button style={{ width: "80%", height: 50 }}>${item}</Button>
              </Grid>
            ))}
          </Grid>
          <Grid container className="mt-15">
            <Grid item xs={12} sm={6} md={6} className="paypalPayment">
              <Grid item xs={12} sm={12} md={12}>
                <div>
                  {language === "en"
                    ? en.wallet.add_funds.funding_amount
                    : vi.wallet.add_funds.funding_amount}
                  :
                </div>
                <div>
                  <InputNumber
                    value={value}
                    min={5}
                    max={2000}
                    onChange={(e) => handleChangeValue(e)}
                  />{" "}
                  USD
                </div>
                <div>
                  {language === "en"
                    ? en.wallet.add_funds.funding_desc
                    : vi.wallet.add_funds.funding_desc}
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={12} className="checkbox pb-50">
                <Checkbox onChange={handleCheckboxChange}>
                  {language === "en"
                    ? en.wallet.add_funds.check
                    : vi.wallet.add_funds.check}
                </Checkbox>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <Button
                  disabled={!isChecked}
                  onClick={() => handlePayment()}
                  className="defaultButton"
                >
                  {language === "en"
                    ? en.wallet.add_funds.continue
                    : vi.wallet.add_funds.continue}
                </Button>
              </Grid>
            </Grid>
            {transactions && transactions.length > 0 && (
              <Grid item xs={12} sm={6} md={6}>
                <h2>
                  {" "}
                  {language === "en"
                    ? en.wallet.add_funds.recent_transactions
                    : vi.wallet.add_funds.recent_transactions}
                </h2>

                <table className="bordered-table">
                  <thead>
                    <tr>
                      <th>
                        {language === "en"
                          ? en.wallet.add_funds.time
                          : vi.wallet.add_funds.time}
                      </th>
                      <th>
                        {language === "en"
                          ? en.wallet.add_funds.method
                          : vi.wallet.add_funds.method}
                      </th>
                      <th>
                        {language === "en"
                          ? en.wallet.add_funds.amount
                          : vi.wallet.add_funds.amount}
                      </th>
                      <th>
                        {language === "en"
                          ? en.wallet.add_funds.status
                          : vi.wallet.add_funds.status}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions?.map((trans) => (
                      <tr key={trans._id}>
                        <td>{moment(trans.date).format("LLL")}</td>
                        <td>{trans.paymentMethod}</td>
                        <td>{trans.amount}</td>
                        <td>{trans.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Grid>
            )}
          </Grid>
        </div>
      ) : (
        <Grid container>
          <Grid container>
            <Grid item xs={12} sm={6} md={6}>
              <h1>
                {" "}
                {language === "en"
                  ? en.wallet.add_funds.fund_order
                  : vi.wallet.add_funds.fund_order}
              </h1>
              <Grid container className="addFundsOrder">
                <Grid container className="bd-bt">
                  <Grid item xs={10} sm={10} md={10}>
                    {language === "en"
                      ? en.wallet.add_funds.funding_amount
                      : vi.wallet.add_funds.funding_amount}
                  </Grid>
                  <Grid item xs={2} sm={2} md={2}>
                    ${value} USD
                  </Grid>
                </Grid>
                <Grid container className="bd-bt">
                  <Grid item xs={10} sm={10} md={10}>
                    {language === "en"
                      ? en.wallet.add_funds.processing_fee
                      : vi.wallet.add_funds.processing_fee}
                  </Grid>
                  <Grid item xs={2} sm={2} md={2}>
                    $0 USD
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={10} sm={10} md={10}>
                    {language === "en"
                      ? en.wallet.add_funds.total_cost
                      : vi.wallet.add_funds.total_cost}
                  </Grid>
                  <Grid item xs={2} sm={2} md={2}>
                    ${value} USD
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Grid item xs={12} sm={12} md={12}>
                {language === "en"
                  ? en.wallet.add_funds.total_charge
                  : vi.wallet.add_funds.total_charge}
                : ${value} USD
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <div>
                  {" "}
                  {language === "en"
                    ? en.wallet.add_funds.pay_with
                    : vi.wallet.add_funds.pay_with}
                </div>
                <Grid container style={{ gridGap: 40, padding: 20 }}>
                  {payments.map((payment, index) => (
                    <Grid
                      item
                      xs={3}
                      sm={3}
                      md={3}
                      key={index}
                      className={`payment ${
                        activePayment === index && "activePayment"
                      } `}
                      onClick={() => handleChangePayment(payment.name, index)}
                    >
                      <img src={payment.src} alt="" />
                    </Grid>
                  ))}
                  {paymentMethod === "Paypal" ? (
                    <Grid container className="mt-15">
                      <PayPalScriptProvider options={initialOptions}>
                        <PayPalButtons
                          key={paypalKey}
                          disabled={!isChecked && value}
                          createOrder={(data) => createOrder(data)}
                          onApprove={(data) => onApprove(data)}
                        />
                      </PayPalScriptProvider>
                    </Grid>
                  ) : (
                    paymentMethod === "VNPay" && (
                      <Grid container>
                        <div>
                          <div>
                            {" "}
                            {language === "en"
                              ? en.wallet.add_funds.note
                              : vi.wallet.add_funds.note}
                          </div>
                          <Button
                            onClick={() => handleVNPay()}
                            className="defaultButton"
                          >
                            {language === "en"
                              ? en.wallet.add_funds.vnpay
                              : vi.wallet.add_funds.vnpay}
                          </Button>
                        </div>
                      </Grid>
                    )
                  )}
                  {/* <Grid item md={3} onClick={() => setPayment("vnpay")}>
                    <img
                      src={vnpayTrans}
                      style={{ width: 100, height: 100 }}
                      alt=""
                    />
                  </Grid> */}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}
