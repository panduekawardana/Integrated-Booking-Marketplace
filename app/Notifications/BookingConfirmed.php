<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingConfirmed extends Notification
{
    use Queueable;

    public function __construct(public Booking $booking) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Booking Confirmed - '.$this->booking->booking_code)
            ->greeting('Hello '.$notifiable->name.'!')
            ->line('Your booking '.$this->booking->booking_code.' has been confirmed.')
            ->line('Total: Rp '.number_format($this->booking->final_amount, 0, ',', '.'))
            ->action('View Booking', route('customer.bookings.show', $this->booking))
            ->line('Thank you for using our service!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'booking_id' => $this->booking->id,
            'booking_code' => $this->booking->booking_code,
            'message' => 'Booking '.$this->booking->booking_code.' has been confirmed.',
        ];
    }
}
