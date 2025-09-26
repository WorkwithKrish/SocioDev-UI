import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";

const Premium = () => {
  const [isUserPremium, setIsUserPremium] = useState(false);
  useEffect(() => {
    verifyPremiumUser();
  }, []);

  const verifyPremiumUser = async () => {
    const res = await axios.get(BASE_URL + "/premium/verify", {
      withCredentials: true,
    });

    if (res.data.isPremium) {
      setIsUserPremium(true);
    }
  };

  const handleBuyClick = async (type) => {
    try {
      const orderRes = await axios.post(
        BASE_URL + "/payment/create",
        {
          membershipType: type,
        },
        { withCredentials: true }
      );
      console.log(orderRes);
      const { amount, id: order_id, currency, rs_id } = orderRes.data;
      const options = {
        key: rs_id, // Enter the Key ID generated from the Dashboard
        amount: amount.toString(),
        currency: currency,
        name: "SocioDev",
        description: "SocioDev Membership",
        image: "https://example.com/your_logo",
        order_id: order_id,
        callback_url: BASE_URL + "/payment-success",
        handler: validatePayment(response),
        prefill: {
          name: "Gaurav Kumar",
          email: "gaurav.kumar@example.com",
          contact: "9999999999",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };
      const rzp1 = new window.Razorpay(options);
      console.log(rzp1);
      rzp1.open();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      {isUserPremium ? (
        <div className="m-10 font-bold text-3xl">You are a Premium Member</div>
      ) : (
        <div className="m-10">
          <div className="flex w-full">
            <div className="card bg-base-300 rounded-box grid h-80 flex-grow place-items-center">
              <h1 className="font-bold text-3xl">Silver Membership</h1>
              <ul>
                <li> - Chat with other people</li>
                <li> - 100 connection Requests per day</li>
                <li> - Blue Tick</li>
                <li> - 3 months</li>
              </ul>
              <button
                onClick={() => handleBuyClick("gold")}
                className="btn btn-secondary"
              >
                Buy Silver
              </button>
            </div>
            <div className="divider divider-horizontal">OR</div>
            <div className="card bg-base-300 rounded-box grid h-80 flex-grow place-items-center">
              <h1 className="font-bold text-3xl">Gold Membership</h1>
              <ul>
                <li> - Chat with other people</li>
                <li> - Inifiniye connection Requests per day</li>
                <li> - Blue Tick</li>
                <li> - 6 months</li>
              </ul>
              <button
                onClick={() => handleBuyClick("gold")}
                className="btn btn-primary"
              >
                Buy Gold
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Premium;
