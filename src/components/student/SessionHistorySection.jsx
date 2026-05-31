import SessionList from "./SessionList";

export default function SessionHistorySection({ sessions }) {
  return (
    <section className="session-history-section">
      <section className="session-history">
        <h2>Session History</h2>
        <SessionList sessions={sessions} />
      </section>
    </section>
  );
}
