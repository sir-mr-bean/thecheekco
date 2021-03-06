import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const VerificationStep = ({ email, page }: { email: string; page: string }) => {
  const [code, setCode] = useState("");
  const tokenRefOne = useRef<HTMLInputElement>(null);
  const tokenRefTwo = useRef<HTMLInputElement>(null);
  const tokenRefThree = useRef<HTMLInputElement>(null);
  const tokenRefFour = useRef<HTMLInputElement>(null);
  const tokenRefFive = useRef<HTMLInputElement>(null);
  const callbackUrl = process.env.API_URL as string;

  const addCodeToString = (character: string, code: string, index: number) => {
    return [code.slice(0, index), character, code.slice(index)].join("");
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    tokenRefOne.current?.focus();
    return () => {
      tokenRefOne.current?.focus();
    };
  }, []);

  const onReady = useCallback(() => {
    if (code) {
      window.location.href = `/api/auth/callback/email?email=${encodeURIComponent(
        email
      )}&token=${code}${callbackUrl ? `&callbackUrl=${callbackUrl}` : ""}`;
    } else {
      toast.error("Please fill in all fields");
    }
  }, [callbackUrl, code, email]);

  const onVerificationCodeKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        onReady();
      }
    },
    [onReady]
  );

  return (
    <div
      className={
        page === "checkout"
          ? `flex w-full flex-col items-center justify-start`
          : `flex h-[70vh] w-full flex-col items-center justify-start`
      }
    >
      <span
        className={
          page === "checkout"
            ? `mb-12 mt-2 w-fit rounded-xl bg-text-secondary px-3 py-2 text-center text-base text-white sm:mb-6 sm:px-6`
            : `mb-12 mt-6 w-fit rounded-xl bg-text-secondary px-3 py-2 text-center text-lg text-white sm:mt-12 sm:mb-24 sm:px-20`
        }
      >
        Email sent! Check your inbox to find your 5 digit verification number.
        This is only valid for 5 minutes.
      </span>
      <span
        className={
          page === "checkout"
            ? `pb-6 pt-2 text-center text-2xl text-text-primary sm:pb-12`
            : `pb-12 pt-2 text-center text-2xl text-text-primary sm:pb-24`
        }
      >
        Enter your 5 digit verification number:
      </span>
      <div className="flex w-full max-w-xl items-center justify-center space-x-6 px-1">
        <input
          ref={tokenRefOne}
          className={
            page === "checkout"
              ? `w-full appearance-none rounded-xl border border-text-primary py-6 text-center text-lg text-text-primary caret-text-secondary focus:border-transparent focus:ring-2 focus:ring-text-primary`
              : `w-full appearance-none rounded-xl border border-text-primary py-10 text-center text-lg text-text-primary caret-text-secondary focus:border-transparent focus:ring-2 focus:ring-text-primary`
          }
          type="number"
          maxLength={1}
          onChange={(e) => {
            setCode(addCodeToString(e.target.value, code, 0));
            tokenRefTwo.current?.focus();
          }}
        />
        <input
          ref={tokenRefTwo}
          className={
            page === "checkout"
              ? `w-full appearance-none rounded-xl border border-text-primary py-6 text-center text-lg text-text-primary caret-text-secondary focus:border-transparent focus:ring-2 focus:ring-text-primary`
              : `w-full appearance-none rounded-xl border border-text-primary py-10 text-center text-lg text-text-primary caret-text-secondary focus:border-transparent focus:ring-2 focus:ring-text-primary`
          }
          type="number"
          maxLength={1}
          onChange={(e) => {
            setCode(addCodeToString(e.target.value, code, 1));
            tokenRefThree.current?.focus();
          }}
        />
        <input
          ref={tokenRefThree}
          className={
            page === "checkout"
              ? `w-full appearance-none rounded-xl border border-text-primary py-6 text-center text-lg text-text-primary caret-text-secondary  focus:border-transparent focus:ring-2 focus:ring-text-primary`
              : `w-full appearance-none rounded-xl border border-text-primary py-10 text-center text-lg text-text-primary caret-text-secondary  focus:border-transparent focus:ring-2 focus:ring-text-primary`
          }
          type="number"
          maxLength={1}
          onChange={(e) => {
            setCode(addCodeToString(e.target.value, code, 2));
            tokenRefFour.current?.focus();
          }}
        />
        <input
          ref={tokenRefFour}
          className={
            page === "checkout"
              ? `w-full appearance-none rounded-xl border border-text-primary py-6 text-center text-lg text-text-primary caret-text-secondary  focus:border-transparent focus:ring-2 focus:ring-text-primary`
              : `w-full appearance-none rounded-xl border border-text-primary py-10 text-center text-lg text-text-primary caret-text-secondary  focus:border-transparent focus:ring-2 focus:ring-text-primary`
          }
          type="number"
          maxLength={1}
          onChange={(e) => {
            setCode(addCodeToString(e.target.value, code, 3));
            tokenRefFive.current?.focus();
          }}
        />
        <input
          ref={tokenRefFive}
          className={
            page === "checkout"
              ? `w-full appearance-none rounded-xl border border-text-primary py-6 text-center text-lg text-text-primary caret-text-secondary  focus:border-transparent focus:ring-2 focus:ring-text-primary`
              : `w-full appearance-none rounded-xl border border-text-primary py-10 text-center text-lg text-text-primary caret-text-secondary  focus:border-transparent focus:ring-2 focus:ring-text-primary`
          }
          type="number"
          maxLength={1}
          onKeyPress={(e: any) => onVerificationCodeKeyPress(e)}
          onChange={(e) => {
            setCode(addCodeToString(e.target.value, code, 4));
          }}
        />
      </div>
      <div
        className={
          page === "checkout"
            ? `flex w-full items-center justify-center pt-12`
            : `flex w-full items-center justify-center pt-24`
        }
      >
        <button
          className="w-fit appearance-none rounded-xl border border-transparent bg-button py-4 px-8 text-center text-xl capitalize text-white hover:border-white focus:border-transparent focus:ring-2 focus:ring-text-primary"
          onClick={onReady}
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default VerificationStep;
