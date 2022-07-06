// import Head from "next/head";

// const VerifyCode = () => {
//   return (
//     <>
//       <Head>
//         <title>The Cheek Co. - Verify Your Email</title>
//         <meta
//           name="description"
//           content="More than just amazing bath and skin care products. Ethically sourced handmade in Australia, cruelty free, vegan."
//         />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
//       <div className="w-full flex items-center justify-center">
//         <div className="bg-white mt-16 mx-auto md:mx-16 rounded-md shadow-sm shadow-black font-gothic text-text-primary w-fit">
//           <div className="px-4 pt-4 pb-16 sm:px-6 sm:pt-8 sm:pb-24 lg:px-8 xl:px-2 xl:pt-14">
//             <div className="flex flex-col font-gothic space-y-3 px-2 sm:px-10 text-sm sm:text-base">
//               <h1 className="text-2xl sm:text-4xl py-4">Magic Link Sent!</h1>
//               <p>
//                 Check your email account for a sign in link. This email will
//                 come from donotreply@thecheekco.com.
//               </p>
//               <p>
//                 Please check your junk mail if you do not see the email arrive
//                 within the next few minutes.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default VerifyCode;

import React, { KeyboardEvent, useCallback, useState } from "react";

interface VerificationStepProps {
  email: string;
  callbackUrl?: string;
}

/**
 * User has inserted the email and now he can put the verification code
 */

const VerificationStep: React.FC<VerificationStepProps> = ({
  email,
  callbackUrl,
}) => {
  const [code, setCode] = useState("");

  const onReady = useCallback(() => {
    window.location.href = `/api/auth/callback/email?email=${encodeURIComponent(
      email
    )}&token=${code}${callbackUrl ? `&callbackUrl=${callbackUrl}` : ""}`;
  }, [callbackUrl, code, email]);

  const onKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        onReady();
      }
    },
    [onReady]
  );

  return (
    <div>
      <h2>Verify email</h2>
      <p>Insert the magic code you received on your email</p>
      <label>
        Magic code:
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyPress={onKeyPress}
        />
      </label>

      <button onClick={onReady}>Go</button>
    </div>
  );
};

export default VerificationStep;
