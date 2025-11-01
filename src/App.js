// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
// import { CssBaseline } from '@mui/material';
// import { SnackbarProvider } from 'notistack';

// import { AuthProvider, useAuth } from './context/AuthContext';
// import Login from './pages/Login.jsx';
// import Register from './pages/Register';
// import Dashboard from './pages/Dashboard';
// import DocumentView from './pages/DocumentView';
// import Layout from './components/Layout';

// // Create theme
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#2563eb',
//       light: '#60a5fa',
//       dark: '#1d4ed8',
//     },
//     secondary: {
//       main: '#7c3aed',
//     },
//     background: {
//       default: '#f8fafc',
//       paper: '#ffffff',
//     },
//   },
//   typography: {
//     fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
//     h4: {
//       fontWeight: 600,
//     },
//     h6: {
//       fontWeight: 600,
//     },
//   },
//   shape: {
//     borderRadius: 8,
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           textTransform: 'none',
//           fontWeight: 600,
//         },
//       },
//     },
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
//           borderRadius: 12,
//         },
//       },
//     },
//   },
// });

// // Protected Route Component
// const ProtectedRoute = ({ children }) => {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return (
//       <div style={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: '100vh'
//       }}>
//         <div>Loading...</div>
//       </div>
//     );
//   }

//   return user ? children : <Navigate to="/login" />;
// };

// // Public Route Component (only for non-authenticated users)
// const PublicRoute = ({ children }) => {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return (
//       <div style={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: '100vh'
//       }}>
//         <div>Loading...</div>
//       </div>
//     );
//   }

//   return !user ? children : <Navigate to="/dashboard" />;
// };

// function App() {
//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <SnackbarProvider
//         maxSnack={3}
//         anchorOrigin={{
//           vertical: 'top',
//           horizontal: 'right',
//         }}
//         autoHideDuration={3000}
//       >
//         <AuthProvider>
//           <Router>
//             <Routes>
//               {/* <Route path="/login" element={
//                 <PublicRoute>
//                   <Login />
//                 </PublicRoute>
//               } /> */}
//               <Route path="/login" element={<Login />} />

//               <Route path="/register" element={
//                 <PublicRoute>
//                   <Register />
//                 </PublicRoute>
//               } />
//               <Route path="/dashboard" element={
//                 <ProtectedRoute>
//                   <Layout>
//                     <Dashboard />
//                   </Layout>
//                 </ProtectedRoute>
//               } />
//               <Route path="/document/:id" element={
//                 <ProtectedRoute>
//                   <Layout>
//                     <DocumentView />
//                   </Layout>
//                 </ProtectedRoute>
//               } />
//               <Route path="/" element={<Navigate to="/dashboard" />} />
//             </Routes>
//           </Router>
//         </AuthProvider>
//       </SnackbarProvider>
//     </ThemeProvider>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';

import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import DocumentView from './pages/DocumentView.jsx';
import Layout from './components/Layout.jsx';

// 🌈 MUI Theme Setup
const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
      light: '#60a5fa',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#7c3aed',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow:
            '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          borderRadius: 12,
        },
      },
    },
  },
});

// 🔒 Protected Route (requires login)
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

// 🔓 Public Route (only when not logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  return !user ? children : <Navigate to="/dashboard" />;
};

// 🌐 Main App Component
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        autoHideDuration={3000}
      >
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/document/:id"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <DocumentView />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </Router>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
