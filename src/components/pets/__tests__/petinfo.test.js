import { rest } from "msw";
import { setupServer } from "msw/node";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import renderer from "react-test-renderer";
import PetInfo from "../PetInfo";
import Router from "react-router-dom";
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

const server = setupServer(
  rest.get("https://api.petfinder.com/v2/animals/1234", (req, res, ctx) => {
    return res(
      ctx.json({
        animal: {
          name: "doggo",
          description: "cute doggo",
          breeds: { primary: "french bulldog" },
          age: 42,
          gender: "male",
          contact: {
            email: "random@email.com",
          },
          url: "pawternity.com",
        },
      })
    );
  })
);
setupServer;
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
test("on initial  page", async () => {
  jest.spyOn(Router, "useParams").mockReturnValue({ id: "1234" });
  jest.useFakeTimers();
  render(<PetInfo />);
  const logo = screen.getByRole("img");
  expect(logo).toHaveAttribute("src", "spinner.gif");
  expect(logo).toHaveAttribute("alt", "Loading...");
  // await waitForElementToBeRemoved(() => screen.getByRole("img"));
  // const { findByText } = render(<PetInfo />);
  const tree = renderer.create(<PetInfo />);
  expect(tree).toMatchSnapshot();
  // const el = await findByText(/Doggo/i);

  // expect(el).toBeInTheDocument();
});
