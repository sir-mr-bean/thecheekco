import { Dialog } from "@headlessui/react";

const SuccessModal = ({
  orderComplete,
  setOrderComplete,
}: {
  orderComplete: boolean;
  setOrderComplete: (setOrderComplete: boolean) => void;
}) => {
  return (
    <Dialog open={orderComplete} onClose={() => setOrderComplete(false)}>
      <Dialog.Panel>
        <Dialog.Title>Deactivate account</Dialog.Title>
        <Dialog.Description>
          This will permanently deactivate your account
        </Dialog.Description>

        <p>
          Are you sure you want to deactivate your account? All of your data
          will be permanently removed. This action cannot be undone.
        </p>

        <button onClick={() => setOrderComplete(false)}>Deactivate</button>
        <button onClick={() => setOrderComplete(false)}>Cancel</button>
      </Dialog.Panel>
    </Dialog>
  );
};

export default SuccessModal;
