import { act, fireEvent, render, screen } from "@testing-library/react";
import { sceneStartMilliseconds } from "@/lib/smartEnergyExplainer/timeline";
import { SMART_ENERGY_EXPLAINER_LABELS as labels } from "@/test/smartEnergyExplainerLabels";
import { SmartEnergyFlowExplainer } from "./SmartEnergyFlowExplainer";

const reducedMotion = vi.hoisted(() => ({ value: false }));

vi.mock("@/hooks/usePrefersReducedMotion", () => ({
  usePrefersReducedMotion: () => reducedMotion.value,
}));

const status = () => screen.getByRole("status");

const advance = (milliseconds: number) =>
  act(() => {
    vi.advanceTimersByTime(milliseconds);
  });

describe("SmartEnergyFlowExplainer", () => {
  beforeEach(() => {
    reducedMotion.value = false;
    vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame", "performance"] });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("starts no animation frame for a fixed frame", () => {
    const request = vi.spyOn(window, "requestAnimationFrame");
    render(<SmartEnergyFlowExplainer labels={labels} frameAtMilliseconds={sceneStartMilliseconds("stores") + 400} />);
    expect(request).not.toHaveBeenCalled();
    expect(screen.getByRole("img", { name: "Two stores behind one port" })).toBeInTheDocument();
    expect(screen.getByText("lock (gate)")).toBeInTheDocument();
    expect(screen.getByText("Scene 6 of 11")).toBeInTheDocument();
  });

  it("advances the status from the title to the layers after 3000 milliseconds", () => {
    render(<SmartEnergyFlowExplainer labels={labels} />);
    expect(status()).toHaveTextContent("Five questions. One drawing answers them in order.");
    advance(3100);
    expect(status()).toHaveTextContent("The layers.");
    expect(screen.getByText("Scene 2 of 11")).toBeInTheDocument();
  });

  it("pauses while the pointer is over the figure and resumes when it leaves", () => {
    render(<SmartEnergyFlowExplainer labels={labels} />);
    const figure = screen.getByRole("figure");
    fireEvent.pointerEnter(figure);
    advance(4000);
    expect(status()).toHaveTextContent("Five questions.");
    fireEvent.pointerLeave(figure);
    advance(3100);
    expect(status()).toHaveTextContent("The layers.");
  });

  it("pauses while focus is within the figure and resumes on blur", () => {
    render(
      <>
        <SmartEnergyFlowExplainer labels={labels} />
        <button type="button">Outside</button>
      </>
    );
    const next = screen.getByRole("button", { name: "Next scene" });
    const previous = screen.getByRole("button", { name: "Previous scene" });
    act(() => next.focus());
    advance(4000);
    expect(status()).toHaveTextContent("Five questions.");
    act(() => previous.focus());
    advance(4000);
    expect(status()).toHaveTextContent("Five questions.");
    act(() => screen.getByRole("button", { name: "Outside" }).focus());
    advance(3100);
    expect(status()).toHaveTextContent("The layers.");
  });

  it("toggles pause with aria-pressed", () => {
    render(<SmartEnergyFlowExplainer labels={labels} />);
    const pause = screen.getByRole("button", { name: "Pause" });
    expect(pause).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(pause);
    expect(pause).toHaveAttribute("aria-pressed", "true");
    fireEvent.blur(pause);
    advance(4000);
    expect(status()).toHaveTextContent("Five questions.");
    fireEvent.click(pause);
    expect(pause).toHaveAttribute("aria-pressed", "false");
  });

  it("resumes on Play even while the pointer and focus are inside the figure", () => {
    render(<SmartEnergyFlowExplainer labels={labels} />);
    const pause = screen.getByRole("button", { name: "Pause" });
    fireEvent.pointerEnter(screen.getByRole("figure"));
    act(() => pause.focus());
    fireEvent.click(pause);
    fireEvent.click(pause);
    advance(3100);
    expect(status()).toHaveTextContent("The layers.");
  });

  it("jumps with Next and Previous and wraps at both ends", () => {
    render(<SmartEnergyFlowExplainer labels={labels} frameAtMilliseconds={0} />);
    fireEvent.click(screen.getByRole("button", { name: "Previous scene" }));
    expect(status()).toHaveTextContent("Closing.");
    expect(screen.getByText("Scene 11 of 11")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Next scene" }));
    expect(status()).toHaveTextContent("Five questions.");
    fireEvent.click(screen.getByRole("button", { name: "Next scene" }));
    expect(status()).toHaveTextContent("The layers.");
  });

  it("shows the last frame of each scene as a still with reduced motion and requests no frame", () => {
    reducedMotion.value = true;
    const request = vi.spyOn(window, "requestAnimationFrame");
    render(<SmartEnergyFlowExplainer labels={labels} />);
    expect(screen.getByText("Question five")).toHaveAttribute("opacity", "1");
    for (let step = 0; step < 6; step += 1) {
      fireEvent.click(screen.getByRole("button", { name: "Next scene" }));
    }
    expect(screen.getByRole("img", { name: "How the data stays consistent" })).toBeInTheDocument();
    expect(screen.getByText("command_audit row in the same transaction")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(3);
    expect(request).not.toHaveBeenCalled();
  });

  it("cancels the animation frame on unmount", () => {
    const cancel = vi.spyOn(window, "cancelAnimationFrame");
    const { unmount } = render(<SmartEnergyFlowExplainer labels={labels} />);
    advance(100);
    unmount();
    expect(cancel).toHaveBeenCalled();
  });
});
