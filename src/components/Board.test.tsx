import { fireEvent, render, screen } from "@testing-library/react";
import Board from "./Board";
import { BoardType } from "./TrelloBoard";
import DragDropProvider from "@/providers/DragDropProvider";

describe("Board Component", () => {
  let board: BoardType = {
    id: 1,
    name: "Doing",
    tasks: [],
  };
  beforeEach(() => {
    render(
      <DragDropProvider>
        <Board board={board} />
      </DragDropProvider>
    );
  });
  it("should render board name based on the prop", () => {
    expect(screen.getByTestId("board-header-text")).toHaveTextContent("Doing");
  });

  it("should display input field on add task button click", () => {
    const button = screen.getByTestId("add-task");
    const input = screen.queryByTestId("add-task-input");

    expect(input).not.toBeInTheDocument();
    fireEvent.click(button);
    expect(screen.getByTestId("add-task-input")).toBeVisible();
  });

  it('should hide input field on espace key press', () => {
    const button = screen.getByTestId("add-task");
    const input = screen.queryByTestId("add-task-input");
    expect(input).not.toBeInTheDocument()

    fireEvent.click(button)
    expect(screen.getByTestId('add-task-input')).toBeVisible()

    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape', charCode: 27  } )
    expect(input).not.toBeInTheDocument()
    
  }) 
});
