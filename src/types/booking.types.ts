// src/types/booking.types.ts

export interface CreateBookingRequest {
    scheduleId: string;
    seatIds: string[];
    customerName?: string;
    customerAddress?: string;
    customerEmail?: string;
}

export interface CreateBookingResponse {
    orderId: string;
    paymentUrl: string;
    totalPrice: number;
    totalQuantity: number;
    orderDate: string;
}

export interface PaymentEvent {
    orderId: string;
    status: "success" | "failed";
    message: string;
    transactionId?: string;
    totalPrice?: number;
}
