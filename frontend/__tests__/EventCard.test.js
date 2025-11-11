// __tests__/EventCard.test.js
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Make imports resolve like in the app
import EventCard from "@/components/UI Components/EventCard";

// Mock Next.js Link since tests run outside of Next runtime
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children }) => children,
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

// Mock contexts used by EventCard so we can render it in isolation
jest.mock("@/contexts/UserContext", () => ({
  useUser: () => ({
    isFavorite: () => false,
    addToFavorites: () => {},
    removeFromFavorites: () => {},
  }),
}));

jest.mock("@/contexts/EventsContext", () => ({
  useEvents: () => ({
    deleteEvent: () => {},
    flagEvent: () => {},
    unflagEvent: () => {},
  }),
}));

describe("EventCard Component", () => {
  test("renders event title and date correctly", () => {
    const event = { title: "Tech Expo", date: "2025-12-05" };

    render(<EventCard event={event} />);

    expect(screen.getByText("Tech Expo")).toBeInTheDocument();
    expect(screen.getByText("2025-12-05")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /view details/i })).toBeInTheDocument();
  });
});
