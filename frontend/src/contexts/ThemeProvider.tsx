import { useEffect, useState } from "react";
import { ThemeContext, type Theme } from "../types/themeContext";


export function ThemeProvider({ children }: { children: React.ReactNode }) {
const [theme, setTheme] = useState<Theme>(() => {
return (localStorage.getItem("theme") as Theme) || "light";
});


useEffect(() => {
const root = document.documentElement;
root.classList.remove("light", "dark");
root.classList.add(theme);
localStorage.setItem("theme", theme);
}, [theme]);


function toggleTheme() {
setTheme((prev) => (prev === "light" ? "dark" : "light"));
}


return (
<ThemeContext.Provider value={{ theme, toggleTheme }}>
{children}
</ThemeContext.Provider>
);
}