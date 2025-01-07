"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import createSession from "../actions/createSession";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/context/authContext";
import validator from "validator";

const defaultState = {
  email: "",
  password: "",
};

const LoginPage = () => {
  const [formData, setFormData] = useState(defaultState);
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const router = useRouter();

  const handleChange = e => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    // Clear previous error messages
    setError("");

  // Validation logic
  if (!validator.isEmail(formData.email)) {
    setError("Invalid email");
    setLoading(false);
    return;
  }
  if (!validator.isLength(formData.password, { min: 5 })) {
    setError("Password must be at least 5 characters");
    setLoading(false);
    return;
  }

    try {
      const formDataObject = new FormData();
      formDataObject.append("email", formData.email.trim());
      formDataObject.append("password", formData.password);

      const response = await createSession(formDataObject);

      if (response.success) {
        toast.success("Logged in successfully!");
        setIsAuthenticated(true);
        router.push("/");
      } else {
        toast.error(response.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error.message);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
      // Reset form data to the default state
      setFormData(defaultState);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  return (
    <div className='flex items-center justify-center'>
      <div className='bg-white shadow-lg rounded-lg p-6 w-full max-w-sm mt-20'>
        <form onSubmit={handleSubmit}>
          <h2 className='text-2xl font-bold text-center text-gray-800 mb-6'>Login</h2>

          {/* email input */}
          <div className='mb-4'>
            <label htmlFor='email' className='block text-gray-700 font-bold mb-2'>
              Email
            </label>
            <input
              type='email'
              id='email'
              // name='email'
              className='border rounded w-full py-2 px-3'
              autoComplete='email'
              value={formData.email}
              onChange={handleChange}
              // required
            />
          </div>

          {/* password input */}
          <div className='mb-6'>
            <label htmlFor='password' className='block text-gray-700 font-bold mb-2'>
              Password
            </label>
            <input
              type='password'
              id='password'
              // name='password'
              className='border rounded w-full py-2 px-3'
              autoComplete='password'
              value={formData.password}
              onChange={handleChange}
              // required
            />
          </div>

          {/* login button */}
          <div className='flex flex-col gap-5'>
            {/* Validation error */}
            {error && <p className='text-red-500 text-sm'>{error}</p>}

            <button
              type='button'
              onClick={handleSubmit}
              className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "logging in..." : "Submit"}
            </button>

            {/* Register link */}
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
