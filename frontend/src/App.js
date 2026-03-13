import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/styles/main.scss";
import AssignmentList from "@/pages/AssignmentList";
import AssignmentAttempt from "@/pages/AssignmentAttempt";

function App() {
  return (
    <div className="App app-shell" data-testid="app-shell">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AssignmentList />} />
          <Route path="/assignment/:id" element={<AssignmentAttempt />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
