import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import axios from "../../api/axios";

export default function PayFail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const orderId = params.get("orderId");
  const reason =
    params.get("message") || "결제 실패";

  const handleConfirm = async () => {
    await axios.post("/payment/fail", {
      orderId,
      reason,
    });
    navigate(`/order/fail/${orderId}`, {
      replace: true,
    });
  };

  return (
    <div className="pay-result fail">
      <h2>결제가 실패했습니다</h2>
      <p>{reason}</p>
      <button onClick={handleConfirm}>
        확인
      </button>
    </div>
  );
}
