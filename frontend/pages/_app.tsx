// This component is common across app pages
import React from "react";
import { AppProps } from "next/app";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";

const App: React.FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
