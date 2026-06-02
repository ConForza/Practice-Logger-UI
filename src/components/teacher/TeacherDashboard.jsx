import { getTeacherStudents } from "../../services/api";

const TEACHER_VIEW_COPY = {
  dashboard: {
    title: "Teacher Dashboard",
    description: "Review student progress and assign practice work.",
    cardTitle: "Teacher features coming soon",
    cardText:
      "Soon you will be able to view students, inspect practice history, and assign tasks.",
  },
  students: {
    title: "Students",
    description: "View students and review their practice activity.",
    cardTitle: "Student list coming soon",
    cardText:
      "This view will show students connected to your teaching dashboard.",
  },
  assignments: {
    title: "Assignments",
    description: "Create and review assigned practice tasks.",
    cardTitle: "Assignments coming soon",
    cardText:
      "This view will let you assign practice work to selected students.",
  },
};

export default function TeacherDashboard({ activeView }) {
  const viewCopy = TEACHER_VIEW_COPY[activeView] || TEACHER_VIEW_COPY.dashboard;

  return (
    <div className="dashboard-page teacher-dashboard">
      <div className="dashboard-page__header">
        <div>
          <h2>{viewCopy.title}</h2>
          <p>{viewCopy.description}</p>
        </div>
      </div>

      <section className="dashboard-card">
        <h3>{viewCopy.cardTitle}</h3>
        <p>{viewCopy.cardText}</p>
      </section>
    </div>
  );
}
