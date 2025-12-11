import {Routes, Route} from "react-router-dom";
import CreateWorkshop from "../pages/admin/CreateWorkshop.jsx";
import AdminDashboard from "../pages/admin/admin-dashboard/AdminDashboard.jsx";
import ManageUsers from "../pages/admin/ManageUsers.jsx";
import UserWorkshops from "../pages/user/UserWorkshops.jsx";
import CategoryView from "../pages/user/Learn&EngagePage/CategoryView.jsx";
import Home from "../../src/pages/user/home/Home.jsx";
import About from "../pages/user/AboutPage/About.jsx";
import BookingPage from "../pages/user/BookingPage/BookingPage.jsx";
import ExplorePage from "../pages/user/ExplorePage/ExplorePage.jsx";
import ContactPage from "../pages/user/ContactPage/ContactPage.jsx";
import ServicesPage from "../pages/user/ServicesPage/ServicesPage.jsx";
import BookingForm from "../components/BookingForm.jsx";
import SchoolVisitForm from "../pages/user/SchoolVisitFormPage/SchoolVisitForm.jsx";
import Membership from "../pages/user/MemberShipPage/Membership.jsx";
import InternshipForm from "../pages/user/InternshipPage/InternshipForm.jsx";
import TeamPage from "../pages/user/TeamPage/TeamPage.jsx";
import CareersPage from "../pages/user/CareersPage/CareersPage.jsx";
import AppointmentForm from "../pages/user/AppointmentPage/AppointmentForm.jsx";
import Courses from "../pages/user/Courses/Courses.jsx";
import AdminLogin from "../pages/admin/admin-login/AdminLogin.jsx";
import AdminWorkshop from "../pages/admin/pages/AdminWorkshop/AdminWorkshop.jsx";
import AdminServices from "../pages/admin/admin-service/AdminServices.jsx";
import MembershipApplication from "../pages/admin/admin-membership/MembershipApplication.jsx";
import Login from "../pages/user/LoginPage/Login.jsx";
import CreateAccount from "../pages/user/CreateAccount/CreateAccount.jsx";
import ForgotPassword from "../pages/user/ForgotPasswordPage/ForgotPassword.jsx";
import Account from "../components/Account.jsx";
import AccountPage from "../pages/user/AccountPage/AccountPage.jsx";
import InternshipAdminPage from "../pages/admin/admin-internship/InternshipAdminPage.jsx";
import CareersAdminPage from "../pages/admin/admin-career/CareerAdminPage.jsx";
import ManageAppointments from "../pages/admin/admin-appointment/ManageAppointments.jsx";
import AdminCourses from "../pages/admin/admin-courses/AdminCourses.jsx";
import AdminAnnouncementPage from "../pages/admin/admin-announcement/AdminAnnouncement.jsx";
import AdminSchoolVisits from "../pages/admin/admin-school-visit/AdminschoolVisit.jsx";
import Feedback from "../pages/user/FeedBackPage/Feedback.jsx";
import AdminFeedback from "../pages/admin/admin-feedback/AdminFeedback.jsx";
import Facilities from "../pages/user/BookingPage/FacilitiesPage/FacilitiesPage.jsx";
import RecommendedAge from "../pages/user/BookingPage/RecommendedAgePage/RecommendedAge.jsx";
import SafetyPage from "../pages/user/BookingPage/SafetyPage/SafetyPage.jsx";
import VisitPage from "../pages/user/Visit-Page/VisitPage.jsx";
import Unauthorized from "../pages/admin/admin-unauthorized/unauthorized.jsx"; // 🆕 add a simple unauthorized page
import AdminProtectedRoute from "../pages/admin/AdminProtectedRoute/AdminProtectedRoute.jsx";
import OAuthSuccess from "../pages/admin/OAuthSuccess.jsx";
import TeacherTrainingForm from "../pages/user/TeacherTraningPage/TeacherTrainingForm.jsx";
import AdminTeacherTraining from "../pages/admin/admin-teacher-training/AdminTeacherTraining.jsx"; // 🆕 import our new guard

const AppRoutes = () => {
    return (
        <Routes>
            {/* Admin Login (public) */}
            <Route path="/admin-login" element={<AdminLogin/>}/>

            {/* 🛡️ Protected Admin routes */}
            <Route
                path="/admin/*"
                element={
                    <AdminProtectedRoute>
                        <AdminDashboard/>
                    </AdminProtectedRoute>
                }
            />
            <Route
                path="/admin/workshops/new"
                element={
                    <AdminProtectedRoute>
                        <CreateWorkshop/>
                    </AdminProtectedRoute>
                }
            />
            <Route
                path="/admin/users"
                element={
                    <AdminProtectedRoute>
                        <ManageUsers/>
                    </AdminProtectedRoute>
                }
            />
            <Route
                path="/admin/workshops"
                element={
                    <AdminProtectedRoute>
                        <AdminWorkshop/>
                    </AdminProtectedRoute>
                }
            />
            <Route
                path="/admin/services"
                element={
                    <AdminProtectedRoute>
                        <AdminServices/>
                    </AdminProtectedRoute>
                }
            />
            <Route
                path="/admin/memberships"
                element={
                    <AdminProtectedRoute>
                        <MembershipApplication/>
                    </AdminProtectedRoute>
                }
            />
            <Route
                path="/admin/internships"
                element={
                    <AdminProtectedRoute>
                        <InternshipAdminPage/>
                    </AdminProtectedRoute>
                }
            />
            <Route
                path="/admin/careers"
                element={
                    <AdminProtectedRoute>
                        <CareersAdminPage/>
                    </AdminProtectedRoute>
                }
            />
            <Route
                path="/admin/appointments"
                element={
                    <AdminProtectedRoute>
                        <ManageAppointments/>
                    </AdminProtectedRoute>
                }
            />
            <Route
                path="/admin/courses"
                element={
                    <AdminProtectedRoute>
                        <AdminCourses/>
                    </AdminProtectedRoute>
                }
            />
            <Route
                path="/admin/announcement"
                element={
                    <AdminProtectedRoute>
                        <AdminAnnouncementPage/>
                    </AdminProtectedRoute>
                }
            />
            <Route
                path="/admin/school-visits"
                element={
                    <AdminProtectedRoute>
                        <AdminSchoolVisits/>
                    </AdminProtectedRoute>
                }
            />
            <Route
                path="/admin/feedbacks"
                element={
                    <AdminProtectedRoute>
                        <AdminFeedback/>
                    </AdminProtectedRoute>
                }
            />

            <Route
                path="/admin/teacher-training"
                element={
                    <AdminProtectedRoute>
                        <AdminTeacherTraining/>
                    </AdminProtectedRoute>
                }
            />

            {/* User routes */}
            <Route path="/users/workshops" element={<UserWorkshops/>}/>
            <Route path="/learn&engage" element={<CategoryView/>}/>
            <Route path="/users/home" element={<Home/>}/>
            <Route path="/about" element={<About/>}/>
            <Route path="/users/booking" element={<BookingPage/>}/>
            <Route path="/users/explore" element={<ExplorePage/>}/>
            <Route path="/users/contact" element={<ContactPage/>}/>
            <Route path="/users/services" element={<ServicesPage/>}/>
            <Route path="/booking-service" element={<BookingForm/>}/>
            <Route path="/school-visit" element={<SchoolVisitForm/>}/>
            <Route path="/membership" element={<Membership/>}/>
            <Route path="/internships" element={<InternshipForm/>}/>
            <Route path="/team" element={<TeamPage/>}/>
            <Route path="/careers" element={<CareersPage/>}/>
            <Route path="/appointment" element={<AppointmentForm/>}/>
            <Route path="/courses" element={<Courses/>}/>
            <Route path="/user-login" element={<Login/>}/>
            <Route path="/user-create-account" element={<CreateAccount/>}/>
            <Route path="/user-forgot-password" element={<ForgotPassword/>}/>
            <Route path="/user-myaccount" element={<AccountPage/>}/>
            <Route path="/user/feedback" element={<Feedback/>}/>
            <Route path="/facilities" element={<Facilities/>}/>
            <Route path="/user/recommendedAge" element={<RecommendedAge/>}/>
            <Route path="/user/safety" element={<SafetyPage/>}/>
            <Route path="/user/visits" element={<VisitPage/>}/>
            <Route path="/user/teacher-training" element={<TeacherTrainingForm/>}/>

            {/* Common routes */}
            <Route path="/" element={<Home/>}/>
            <Route path="/account" element={<Account/>}/>
            <Route path="/admin/oauth-success" element={<OAuthSuccess/>}/>
            <Route path="/unauthorized" element={<Unauthorized/>}/>

        </Routes>
    );
};

export default AppRoutes;
