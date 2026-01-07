import { Payment } from "../models/billing/payment.model";
import { PaymentCreateType, PaymentType } from "../types/billing/payment.type";

class PaymentRepository {
    public create(dto: PaymentCreateType): Promise<PaymentType> {
        return Payment.create(dto);
    }
}

export const paymentRepository = new PaymentRepository();
