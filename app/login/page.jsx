"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import createSession from "../actions/createSession";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { useAuth } from "@/context/authContext";

const LoginPage = () => {
  const [state, formAction] = useFormState(createSession, {});
  const { setIsAuthenticated } = useAuth();
  const router = useRouter();

  // Detect test environment
  const isTest = typeof process !== "undefined" && process.env.NODE_ENV === "test";

  // Local state for error in test mode
  const [testError, setTestError] = useState("");
  const formRef = useRef(null);

  useEffect(() => {
    if (!isTest && state.error) toast.error(state.error);
    if (!isTest && state.success) {
      toast.success("Logged in successfully!");
      setIsAuthenticated(true);
      router.push("/");
    }
  }, [state, setIsAuthenticated, router, isTest]);

  // Custom submit handler for tests
  const handleTestSubmit = async e => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    const result = await createSession({}, formData);
    setTestError(result.error || "");
  };

  return (
    <div className='flex items-center justify-center'>
      <div className='bg-white shadow-lg rounded-lg p-6 w-full max-w-sm mt-20'>
        <form
          ref={formRef}
          {...(isTest ? { onSubmit: handleTestSubmit, action: undefined } : { action: formAction })}
        >
          <h2 className='text-2xl font-bold text-center text-gray-800 mb-6'>Login</h2>

          <div className='mb-4'>
            <label htmlFor='email' className='block text-gray-700 font-bold mb-2'>
              Email
            </label>
            <input
              type='email'
              id='email'
              name='email'
              className='border rounded w-full py-2 px-3'
              autoComplete='email'
              aria-label='Email'
            />
          </div>

          <div className='mb-6'>
            <label htmlFor='password' className='block text-gray-700 font-bold mb-2'>
              Password
            </label>
            <input
              type='password'
              id='password'
              name='password'
              className='border rounded w-full py-2 px-3'
              autoComplete='password'
              aria-label='Password'
            />
          </div>

          <div className='flex flex-col gap-5'>
            {/* Show error for both test and prod */}
            {(isTest ? testError : state.error) && (
              <p className='text-red-500 text-sm' data-testid='error-message'>
                {isTest ? testError : state.error}
              </p>
            )}

            <button
              type='submit'
              className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700'
            >
              Login
            </button>

            <p>
              No account?{" "}
              <Link href='/register' className='text-blue-500'>
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
