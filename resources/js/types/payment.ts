export interface Payment {
    id: number;
    booking_id: number;
    payment_code: string;
    midtrans_transaction_id: string | null;
    midtrans_order_id: string | null;
    gross_amount: string;
    status: 'pending' | 'success' | 'failed' | 'expired' | 'refund';
    payment_method: string | null;
    payment_channel: string | null;
    transaction_time: string | null;
    fraud_status: string | null;
    raw_response: Record<string, unknown> | null;
    paid_at: string | null;
    expired_at: string | null;
    refunded_at: string | null;
    refund_amount: string;
    notes: string | null;
    created_at: string;
}
