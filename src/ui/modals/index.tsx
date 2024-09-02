import React from "react";

export const OtpFormModal = React.lazy(() => import("./otp-login"));

const Modals = () => {
  return (
    <React.Suspense>
      <OtpFormModal />
    </React.Suspense>
  );
};

export default Modals;
