import { render, screen, logRoles } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "./page";

// Mock `useAuth` and `AuthProvider`
vi.mock("@/context/authContext", async () => {
  const actual = await vi.importActual("@/context/authContext");
  return {
    ...actual,
    useAuth: vi.fn(() => ({
      isAuthenticated: false,
      setIsAuthenticated: vi.fn(),
      currentUser: null,
      setCurrentUser: vi.fn(),
    })),
  };
});

// Helper function to get form elements
const getFormElements = () => {
  const elements = {
    emailInput: screen.getByRole("textbox", { name: /email/i }),
    passwordInput: screen.getByLabelText("Password"),
    submitButton: screen.getByRole("button", { name: /submit/i }),
  };
  return elements;
};

// Use describe to group tests together
describe("form-testing", () => {
  // Declare user variable at describe block level so it's accessible in all tests
  let user;
  // beforeEach runs before each test case
  // Used to set up the testing environment in a consistent state
  // This ensures each test starts with fresh DOM and user event instance
  beforeEach(() => {
    // console.log("hello world");
    user = userEvent.setup();
    render(<LoginPage />);
  });

  // test 1
  test("inputs should be initially empty", () => {
    // const { container } = render(<LoginPage />);
    // screen.debug(); // Optional: Outputs the rendered DOM structure for debugging
    // logRoles(container); // Optional: Outputs the roles of all elements in the container
    const { emailInput, passwordInput } = getFormElements();
    expect(emailInput).toHaveValue("");
    expect(passwordInput).toHaveValue("");
  });
  // test 2
  test("should be able to type in the input", async () => {
    const { emailInput, passwordInput } = getFormElements();
    await user.type(emailInput, "test@test.com");
    expect(emailInput).toHaveValue("test@test.com");
    await user.type(passwordInput, "secret");
    expect(passwordInput).toHaveValue("secret");
  });
  // test 3
  test("should show email error if email is invalid", async () => {
    const { emailInput, submitButton } = getFormElements();
    // no error message initially
    expect(screen.queryByText(/invalid email/i)).not.toBeInTheDocument();
    // type invalid email
    await user.type(emailInput, "invalid");
    await user.click(submitButton);
    // check for error message
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });
  // test 4
  test("should show password error if password is less than 5 characters", async () => {
    const { emailInput, passwordInput, submitButton } = getFormElements();
    // no error message initially
    expect(screen.queryByText(/password must be at least 5 characters/i)).not.toBeInTheDocument();
    // type valid email
    await user.type(emailInput, "test@test.com");
    // type password less than 5 characters
    await user.type(passwordInput, "abcd");
    await user.click(submitButton);
    // check for error message
    expect(screen.getByText(/password must be at least 5 characters/i)).toBeInTheDocument();
  });
  // test 5
  test("valid inputs show no errors and clear fields", async () => {
    const { emailInput, passwordInput, submitButton } = getFormElements();
    // type valid email and password
    await user.type(emailInput, "test@test.com");
    await user.type(passwordInput, "secret");
    await user.click(submitButton);
    // no error message if inputs are valid
    expect(screen.queryByText(/invalid email/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/password must be at least 5 characters/i)).not.toBeInTheDocument();
    // fields should be cleared after submission
    expect(emailInput).toHaveValue("");
    expect(passwordInput).toHaveValue("");
  });
});
