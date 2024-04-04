import { useEffect, useState } from "react";

const useSnap = () => {
  const [snap, setSnap] = useState(null);
  const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT;

  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    // const clientKey = midtransPublicClient;
    const script = document.createElement("script");
    script.src = snapScript;
    script.setAttribute("data-client-key", clientKey);
    script.onload = () => {
      setSnap(window.snap);
    };
    // script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const snapEmbed = (snap_token, action) => {
    if (snap) {
      snap.pay(snap_token, {
        onSuccess: function (result) {
          console.log("success", result);
          action.onSuccess(result);
        },
        onPending: function (result) {
          console.log("pending", result);
          action.onPending(result);
          // localStorage.setItem("payment", JSON.stringify(result));
        },
        onError: function (result) {
          /* You may add your own implementation here */
          alert("payment failed!");
          console.log(result);
        },
        onClose: function () {
          /* You may add your own implementation here */
          //   alert("you closed the popup without finishing the payment");
        },
      });
    }
  };
  return { snapEmbed };
};

export default useSnap;
