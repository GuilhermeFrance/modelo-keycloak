import { Dialog } from 'quasar';
import Message from 'src/components/modals/Message.vue';

export default function showModal(message, identification, label) {
  return Dialog.create({
    component: Message,
    componentProps: {
      message, //a mensagem a ser exibida
      identification, //a identificação do item que será excluído
      label: label, //o label a ser exibido no botão de confirmação
    },
  });
}
