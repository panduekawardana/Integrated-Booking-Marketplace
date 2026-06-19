<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingCancelled extends Notification
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
            ->subject('Booking Cancelled - '.$this->booking->booking_code)
            ->greeting('Hello '.$notifiable->name.'!')
            ->line('Your booking '.$this->booking->booking_code.' has been cancelled.')
            ->line('Reason: '.($this->booking->cancellation_reason ?? 'No reason provided.'))
            ->action('View Bookings', route('customer.bookings.index'))
            ->line('If you have any questions, please contact us.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'booking_id' => $this->booking->id,
            'booking_code' => $this->booking->booking_code,
            'message' => 'Booking '.$this->booking->booking_code.' has been cancelled.',
        ];
    }
}
