import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/styles/main.scss";

import AssignmentList from "@/pages/AssignmentList";
import AssignmentAttempt from "@/pages/AssignmentAttempt";
import Playground from "@/pages/Playground";

function App() {
  return (
    <BrowserRouter>
      <div className="App app-shell">
        <Routes>
          <Route path="/" element={<AssignmentList />} />
          <Route path="/assignment/:id" element={<AssignmentAttempt />} />
          <Route path="/playground" element={<Playground />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;