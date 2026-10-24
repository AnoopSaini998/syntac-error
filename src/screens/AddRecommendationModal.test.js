import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddRecommendationModal from "./AddRecommendationModal";

describe("AddRecommendationModal", () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("does not render when open is false", () => {
    const { container } = render(
      <AddRecommendationModal open={false} onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );
    expect(container.firstChild).toBeNull();
  });

  test("renders modal elements when open", () => {
    render(
      <AddRecommendationModal open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );

    expect(screen.getByText("Add Recommendation")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("e.g. Third Wave Coffee")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Keep it short and tell us what makes it special")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /📷 Add Photo/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Post Recommendation/i })).toBeDisabled();
  });

  test("triggers file input when Add Photo button is clicked", () => {
    render(
      <AddRecommendationModal open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );

    const fileInput = screen.getByTestId("photo-file-input");
    const clickSpy = jest.spyOn(fileInput, "click");

    const addPhotoBtn = screen.getByRole("button", { name: /📷 Add Photo/i });
    fireEvent.click(addPhotoBtn);

    expect(clickSpy).toHaveBeenCalled();
  });

  test("allows adding photo via URL and removing it", async () => {
    render(
      <AddRecommendationModal open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );

    const toggleUrlBtn = screen.getByText(/or paste image URL/i);
    fireEvent.click(toggleUrlBtn);

    const urlInput = screen.getByPlaceholderText("https://example.com/photo.jpg");
    fireEvent.change(urlInput, {
      target: { value: "https://images.unsplash.com/photo-example.jpg" },
    });

    const applyBtn = screen.getByRole("button", { name: /^Attach$/i });
    fireEvent.click(applyBtn);

    expect(await screen.findByAltText("Recommendation preview")).toBeInTheDocument();
    expect(screen.getByText(/✓ Photo: Web image/i)).toBeInTheDocument();

    // Now remove it
    const removeBtn = screen.getByLabelText("Remove photo");
    fireEvent.click(removeBtn);

    expect(screen.queryByAltText("Recommendation preview")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /📷 Add Photo/i })).toBeInTheDocument();
  });

  test("shows error when entering invalid URL", () => {
    render(
      <AddRecommendationModal open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );

    fireEvent.click(screen.getByText(/or paste image URL/i));
    const urlInput = screen.getByPlaceholderText("https://example.com/photo.jpg");
    fireEvent.change(urlInput, { target: { value: "not-a-valid-url" } });

    fireEvent.click(screen.getByRole("button", { name: /^Attach$/i }));

    expect(screen.getByText(/URL must start with http:\/\/ or https:\/\//i)).toBeInTheDocument();
  });

  test("submits form with entered details including photo", async () => {
    render(
      <AddRecommendationModal open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );

    // Enter title & reason
    fireEvent.change(screen.getByPlaceholderText("e.g. Third Wave Coffee"), {
      target: { value: "Inception" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Keep it short and tell us what makes it special"),
      { target: { value: "Mind blowing dream concept" } }
    );

    // Add photo via URL
    fireEvent.click(screen.getByText(/or paste image URL/i));
    fireEvent.change(screen.getByPlaceholderText("https://example.com/photo.jpg"), {
      target: { value: "https://example.com/inception.jpg" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^Attach$/i }));

    const postBtn = screen.getByRole("button", { name: /Post Recommendation/i });
    expect(postBtn).not.toBeDisabled();

    fireEvent.click(postBtn);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      category: "movies",
      title: "Inception",
      reason: "Mind blowing dream concept",
      image: "https://example.com/inception.jpg",
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("handles file upload selection", async () => {
    render(
      <AddRecommendationModal open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );

    const file = new File(["dummy content"], "test-photo.png", { type: "image/png" });
    const fileInput = screen.getByTestId("photo-file-input");

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByAltText("Recommendation preview")).toBeInTheDocument();
      expect(screen.getByText(/test-photo.png/i)).toBeInTheDocument();
    });
  });
});
