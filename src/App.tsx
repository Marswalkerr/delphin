import { Routes, Route } from "react-router-dom";
import SigninForm from "./_auth/forms/SigninForm";
import SignupForm from "./_auth/forms/SignupForm";
import { Home } from "./_root/pages";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import { Toaster } from "@/components/ui/toaster"
import CreatePost from "./_root/pages/CreatePost";

import "./globals.css";
import EditPost from "./_root/pages/EditPost";
import PostDetails from "./_root/pages/PostDetails";

const App = () => {
  return (
    <main className="flex h-screen">
      {/* Public Routes */}
      <Routes>
        <Route element={<AuthLayout/>}>
          <Route path="sign-in" element={<SigninForm />} />
          <Route path="sign-up" element={<SignupForm />} />
        </Route>

        {/* Private Routes */}
        <Route element={<RootLayout/>}>
          <Route index element={<Home />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:id" element={<EditPost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
        </Route>
      </Routes>

      <Toaster />
    </main>
  )
}

export default App 