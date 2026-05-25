import SessionList from "./SessionList";

export default function SessionHistorySection({ sessions }) {
  return (
    <section className="session-history-section">
      <SessionList sessions={sessions} />
    </section>
  );
}
