import { Payment } from "../models/payment.model";
import { PaymentCreateType, PaymentType } from "../types/payment.type";

class PaymentRepository {
    public create(dto: PaymentCreateType): Promise<PaymentType> {
        return Payment.create(dto);
    }
}

export const paymentRepository = new PaymentRepository();
