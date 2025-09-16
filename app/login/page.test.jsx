import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "./page";

// Mock `useAuth`
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

// Mock createSession for useFormState
vi.mock("../actions/createSession", () => ({
  __esModule: true,
  default: vi.fn(async (_prevState, formData) => {
    const email = formData.get("email") || "";
    const password = formData.get("password") || "";
    if (!email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
      return { error: "Invalid email" };
    }
    if (password.length < 5) {
      return { error: "Password must be at least 5 characters" };
    }
    return { success: true };
  }),
}));

// Mock react-dom for useFormState
vi.mock("react-dom", () => ({
  ...vi.importActual("react-dom"),
  useFormState: (action, initialState) => [initialState, action],
}));

// Helper function to get form elements
const getFormElements = () => ({
  emailInput: screen.getByLabelText(/email/i),
  passwordInput: screen.getByLabelText(/password/i),
  submitButton: screen.getByRole("button", { name: /login/i }),
});
// Use describe to group tests together
describe("form-testing", () => {
  // Declare user variable at describe block level so it's accessible in all tests
  let user;
  // beforeEach runs before each test case
  // Used to set up the testing environment in a consistent state
  // This ensures each test starts with fresh DOM and user event instance
  beforeEach(() => {
    user = userEvent.setup();
    render(<LoginPage />);
  });
  // test 1: Check if form elements are rendered
  test("inputs should be initially empty", () => {
    // const { container } = render(<LoginPage />);
    // screen.debug(); // Optional: Outputs the rendered DOM structure for debugging
    // logRoles(container); // Optional: Outputs the roles of all elements in the container
    const { emailInput, passwordInput } = getFormElements();
    expect(emailInput).toHaveValue("");
    expect(passwordInput).toHaveValue("");
  });
  // test 2: Simulate typing into inputs and verify values
  test("should be able to type in the input", async () => {
    const { emailInput, passwordInput } = getFormElements();
    await user.type(emailInput, "test@test.com");
    expect(emailInput).toHaveValue("test@test.com");
    await user.type(passwordInput, "secret");
    expect(passwordInput).toHaveValue("secret");
  });
  // test 3: Simulate form submission with invalid email and check for error message
  test("should show email error if email is invalid", async () => {
    const { emailInput, submitButton } = getFormElements();
    // no error message initially
    expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
    // type invalid email
    await user.type(emailInput, "invalid");
    await user.click(submitButton);
    // OR, trigger submit event directly:
    submitButton.form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    // check for error message
    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });
  // test 4: Simulate form submission with short password and check for error message
  test("should show password error if password is less than 5 characters", async () => {
    const { emailInput, passwordInput, submitButton } = getFormElements();
    // no error message initially
    expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
    // type valid email
    await user.type(emailInput, "test@test.com");
    // type password less than 5 characters
    await user.type(passwordInput, "abcd");
    await user.click(submitButton);
    // check for error message
    expect(await screen.findByText(/password must be at least 5 characters/i)).toBeInTheDocument();
  });
  // test 5: Simulate form submission with valid inputs and check no error message
  test("valid inputs show no errors", async () => {
    const { emailInput, passwordInput, submitButton } = getFormElements();
    // type valid email and password
    await user.type(emailInput, "test@test.com");
    await user.type(passwordInput, "secret");
    await user.click(submitButton);
    // no error message if inputs are valid
    expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
  });
});
