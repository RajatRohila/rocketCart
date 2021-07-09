
export class RazorpayRequestBean {
  key: string;
  amount: number;
  currency: string;
  name: string;
  order_id: string;
  image: string;
  prefill = new Prefill();
}
class Prefill {
  name: string;
  email: string;
  contact: string;
}
