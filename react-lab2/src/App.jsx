// GIVEN. The app is two slices on one page: the Courses page (built in the lab, with AI)
// and the course search (built at home, in the pre-lab). React Lab 3 turns the Courses
// page into one screen of a multi-screen app with a router.
import { CoursesPage } from "./courses/CoursesPage.jsx";
import { CourseSearch } from "./search/CourseSearch.jsx";

export default function App() {
  return (
    <main>
      <CoursesPage />
      <CourseSearch />
    </main>
  );
}
