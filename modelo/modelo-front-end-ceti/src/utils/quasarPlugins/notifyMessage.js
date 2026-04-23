import { Notify } from 'quasar';

export default function showNotification(type, message, position, timeout) {
  Notify.create({
    type: type,
    message: message,
    position: position,
    timeout: timeout,
    color: 'green-10',
  });
}
