import { createContext, useContext, useState } from "react";

const SnackbarContext = createContext({
  showSnackbar: (_: string) => {},
});

export const SnackbarProvider = ({ children }: { children: JSX.Element }) => {
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setTimeout(() => {
      setSnackbarMessage("");
    }, 3000); // Snackbar disappears after 3 seconds
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {snackbarMessage && (
        <div className="fixed w-full text-center bottom-16 animate-bounce z-50">
          <span className="bg-surface text-red-400 px-4 py-2 rounded-md shadow-md">
            {snackbarMessage}
          </span>
        </div>
      )}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  return useContext(SnackbarContext);
};
