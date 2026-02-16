import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        const userId = params.get("userId");
        const amount = params.get("amount");

        await axios.post(
          "http://localhost:5000/api/payment/confirm-payment",
          { userId, amount }
        );

        navigate("/wallet");
      } catch (error) {
        console.error("Payment confirmation failed:", error);
      }
    };

    confirmPayment();
  }, []);

  return <div className="text-center mt-10">Processing Payment...</div>;
};

export default PaymentSuccess;
