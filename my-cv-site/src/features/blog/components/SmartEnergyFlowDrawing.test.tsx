import { render, screen } from "@testing-library/react";
import { explainerFrameAtMilliseconds } from "@/lib/smartEnergyExplainer/frame";
import { lastFrameMillisecondsOfScene, sceneStartMilliseconds, type SceneId } from "@/lib/smartEnergyExplainer/timeline";
import { SMART_ENERGY_EXPLAINER_LABELS as labels } from "@/test/smartEnergyExplainerLabels";
import { SmartEnergyFlowDrawing } from "./SmartEnergyFlowDrawing";

const drawAt = (scene: SceneId, offset: number) =>
  render(<SmartEnergyFlowDrawing frame={explainerFrameAtMilliseconds(sceneStartMilliseconds(scene) + offset)} labels={labels} />);

const drawLastFrameOf = (scene: SceneId) =>
  render(<SmartEnergyFlowDrawing frame={explainerFrameAtMilliseconds(lastFrameMillisecondsOfScene(scene))} labels={labels} />);

describe("SmartEnergyFlowDrawing", () => {
  it("names the image with the scene title", () => {
    drawAt("title", 2900);
    expect(screen.getByRole("img", { name: "Five questions" })).toBeInTheDocument();
    expect(screen.getByText("One drawing, five questions")).toBeInTheDocument();
    expect(screen.getByText("Question five")).toBeInTheDocument();
  });

  it("shows the node labels in the layers scene", () => {
    drawAt("layers", 5900);
    expect(screen.getByRole("img", { name: "The layers" })).toBeInTheDocument();
    for (const name of Object.values(labels.nodes)) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
  });

  it("shows the telemetry badges once the reading passes", () => {
    drawAt("telemetry", 7000);
    expect(screen.getByText("ETag")).toBeInTheDocument();
    expect(screen.getByText("304")).toBeInTheDocument();
  });

  it("shows Acknowledged and Confirmed at their command frames with the idempotency key on the way", () => {
    const { unmount } = drawAt("command", 2500);
    expect(screen.getByText("idempotency key")).toBeInTheDocument();
    expect(screen.getByText("Created")).toBeInTheDocument();
    unmount();
    const acknowledged = drawAt("command", 7500);
    expect(screen.getByText("Acknowledged")).toBeInTheDocument();
    acknowledged.unmount();
    drawAt("command", 8100);
    expect(screen.getByText("Confirmed")).toBeInTheDocument();
    expect(screen.queryByText("Failed")).not.toBeInTheDocument();
  });

  it("shows all three terminal badges in the hold", () => {
    drawLastFrameOf("command");
    expect(screen.getByText("side exits")).toBeInTheDocument();
    expect(screen.getByText("Failed")).toBeInTheDocument();
    expect(screen.getByText("Expired")).toBeInTheDocument();
    expect(screen.getByText("Rejected")).toBeInTheDocument();
  });

  it("shows the assistant port with no adapter and the configured adapters", () => {
    const empty = drawAt("ports", 1000);
    expect(screen.queryByText("in-memory")).not.toBeInTheDocument();
    empty.unmount();
    drawLastFrameOf("ports");
    expect(screen.getByText("IAssistant")).toBeInTheDocument();
    expect(screen.getByText("no adapter")).toBeInTheDocument();
    expect(screen.getByText("IoT Hub")).toBeInTheDocument();
    expect(screen.getByText("in-memory")).toBeInTheDocument();
  });

  it("shows both adapters, the transaction and the lock badge with a waiting thread in the stores scene", () => {
    drawAt("stores", 400);
    expect(screen.getByText("Postgres adapter")).toBeInTheDocument();
    expect(screen.getByText("In-memory adapter")).toBeInTheDocument();
    expect(screen.getByText("BEGIN … COMMIT")).toBeInTheDocument();
    expect(screen.getByText("lock (gate)")).toBeInTheDocument();
    expect(screen.getByText("waits")).toBeInTheDocument();
    expect(screen.getAllByText("read only")).toHaveLength(2);
  });

  it("lets the second thread take the lock and lists the hosts", () => {
    const second = drawAt("stores", 1000);
    expect(screen.getByText("lock (gate)")).toBeInTheDocument();
    expect(screen.queryByText("waits")).not.toBeInTheDocument();
    second.unmount();
    drawLastFrameOf("stores");
    expect(screen.queryByText("lock (gate)")).not.toBeInTheDocument();
    expect(screen.getByText("Tests: Testcontainers")).toBeInTheDocument();
  });

  it("bounces the duplicate and keeps the current state in the first two beats", () => {
    const duplicate = drawAt("consistency", 1900);
    expect(screen.getByText("ON CONFLICT DO NOTHING")).toBeInTheDocument();
    duplicate.unmount();
    const early = drawAt("consistency", 200);
    expect(screen.queryByText("ON CONFLICT DO NOTHING")).not.toBeInTheDocument();
    early.unmount();
    drawAt("consistency", 3900);
    expect(screen.getByText("current 12:00")).toBeInTheDocument();
    expect(screen.getByText("only a newer reading moves it")).toBeInTheDocument();
  });

  it("returns already issued and changes zero rows in beats three and four", () => {
    const idempotency = drawAt("consistency", 5900);
    expect(screen.getByText("issued")).toBeInTheDocument();
    expect(screen.getByText("already issued")).toBeInTheDocument();
    idempotency.unmount();
    const racing = drawAt("consistency", 6200);
    expect(screen.queryByText("0 rows, stops")).not.toBeInTheDocument();
    racing.unmount();
    drawAt("consistency", 7900);
    expect(screen.getByText("1 row")).toBeInTheDocument();
    expect(screen.getByText("0 rows, stops")).toBeInTheDocument();
  });

  it("drops the duplicate message and dead letters the expired one in two session lanes", () => {
    drawAt("consistency", 9900);
    expect(screen.getByText("session asset one")).toBeInTheDocument();
    expect(screen.getByText("session asset two")).toBeInTheDocument();
    expect(screen.getByText("same message id dropped")).toBeInTheDocument();
    expect(screen.getByText("expired to dead letter")).toBeInTheDocument();
  });

  it("holds the advisory lock on one host while the other waits", () => {
    const waiting = drawAt("consistency", 10700);
    expect(screen.getByText("pg_advisory_lock")).toBeInTheDocument();
    expect(screen.getByText("waits")).toBeInTheDocument();
    waiting.unmount();
    drawAt("consistency", 11900);
    expect(screen.getByText("schema current")).toBeInTheDocument();
  });

  it("shows the six beat captions and the audit row in the consistency hold", () => {
    drawLastFrameOf("consistency");
    expect(screen.getByRole("img", { name: "How the data stays consistent" })).toBeInTheDocument();
    Object.values(labels.consistency.beats).forEach((beat, index) => {
      expect(screen.getByText(`${index + 1}. ${beat}`)).toBeInTheDocument();
    });
    expect(screen.getByText("command_audit row in the same transaction")).toBeInTheDocument();
  });

  it("lights the fifth asset and the touch points", () => {
    drawAt("assetKind", 3000);
    expect(screen.getByText("Fifth asset")).toBeInTheDocument();
    expect(screen.getByText("7. Touch seven")).toBeInTheDocument();
  });

  it("shows 0, 1 and 3 replicas and S1 in the scale scene", () => {
    const none = drawAt("scale", 1000);
    expect(screen.getByText("0 replicas")).toBeInTheDocument();
    expect(screen.getByText("F1")).toBeInTheDocument();
    none.unmount();
    const one = drawAt("scale", 4000);
    expect(screen.getByText("1 replicas")).toBeInTheDocument();
    one.unmount();
    drawLastFrameOf("scale");
    expect(screen.getByText("3 replicas")).toBeInTheDocument();
    expect(screen.getByText("S1")).toBeInTheDocument();
    expect(screen.getByText("retention runs once")).toBeInTheDocument();
  });

  it("shows the shield labels and the seven gate names in the security hold", () => {
    drawLastFrameOf("security");
    for (const control of Object.values(labels.security.controls)) {
      expect(screen.getByText(control)).toBeInTheDocument();
    }
    for (const gate of labels.security.gates) {
      expect(screen.getByText(gate)).toBeInTheDocument();
    }
  });

  it("shows the closing", () => {
    drawLastFrameOf("closing");
    expect(screen.getByText("never ran at a client")).toBeInTheDocument();
  });
});
