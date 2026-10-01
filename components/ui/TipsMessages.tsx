'use client';


import { useToastStore } from '@/stores/toast';

function TipsMessageContainer() {
  const toasts = useToastStore(state => state.toasts);
  const removeToast = useToastStore(state => state.removeToast);

  return (
    <>
      {toasts.map(toast => (
        <div key={toast.id} className={`tips-message ${toast.type}`} onClick={() => removeToast(toast.id)}>
          {toast.message}
        </div>
      ))}
    </>
  );
}
export default TipsMessageContainer;