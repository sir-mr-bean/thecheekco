import Link from "next/link";
import { BeatLoader } from "react-spinners";
import { Order, OrderLineItem } from "square";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};
