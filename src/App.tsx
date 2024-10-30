import { useEffect, useState } from "react";
import "./App.css";
import { extractRemixContext } from "./parser";

function App() {
  const [shareData, setShareData] = useState<string>("");

  useEffect(() => {
    fetch("/data.html")
      .then((response) => response.text())
      .then((text) => extractRemixContext(text))
      .then((remixContextText) => {
        const remixContext = JSON.parse(remixContextText);
        return remixContext?.state?.loaderData?.[
          "routes/share.$shareId.($action)"
        ]?.serverResponse?.data;
      })
      .then(JSON.stringify)
      .then(setShareData);
  }, []);

  return <div className="card">{shareData}</div>;
}

export default App;
