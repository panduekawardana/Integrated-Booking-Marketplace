<?php

namespace App\Notifications;

use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentReceived extends Notification
{
    use Queueable;

    public function __construct(public Payment $payment) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Payment Received - '.$this->payment->payment_code)
            ->greeting('Hello '.$notifiable->name.'!')
            ->line('Payment of Rp '.number_format($this->payment->gross_amount, 0, ',', '.').' has been received.')
            ->line('Payment Code: '.$this->payment->payment_code)
            ->line('Thank you for your payment!')
            ->action('View Booking', route('customer.bookings.show', $this->payment->booking));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'payment_id' => $this->payment->id,
            'payment_code' => $this->payment->payment_code,
            'amount' => $this->payment->gross_amount,
            'message' => 'Payment of Rp '.number_format($this->payment->gross_amount, 0, ',', '.').' received.',
        ];
    }
}
