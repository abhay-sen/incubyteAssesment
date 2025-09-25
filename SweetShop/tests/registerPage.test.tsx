// tests/RegisterPage.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import RegisterPage from "../src/pages/RegisterPage";


describe("RegisterPage", () => {
  it("renders all form fields", () => {
    render(<RegisterPage onRegister={vi.fn()} />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it("disables register button when inputs are empty", () => {
    render(<RegisterPage onRegister={vi.fn()} />);
    expect(screen.getByRole("button", { name: /register/i })).toBeDisabled();
  });
  it("enables register button when all inputs are filled", () => {
    render(<RegisterPage onRegister={vi.fn()} />);
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "abc123" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "abc123" },
    });
    expect(screen.getByRole("button", { name: /register/i })).toBeEnabled();
  });

  it("shows error if passwords do not match", () => {
    render(<RegisterPage onRegister={vi.fn()} />);
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "secret123" },
    });

    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "different" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  it("calls onRegister with correct data when valid", () => {
    const handleRegister = vi.fn();
    render(<RegisterPage onRegister={handleRegister} />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Abhay" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "abhay@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "secret123" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "secret123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    expect(handleRegister).toHaveBeenCalledWith({
      name: "Abhay",
      email: "abhay@example.com",
      password: "secret123",
    });
  });
});
