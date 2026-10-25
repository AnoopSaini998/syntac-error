import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders auth loading state", () => {
  render(<App />);
  expect(screen.getByText(/loading your picks/i)).toBeInTheDocument();
});
