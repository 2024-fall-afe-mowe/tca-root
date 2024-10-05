import { useNavigate } from "react-router-dom";

export const Setup = () => {

    const myNav = useNavigate();

    return (
      <div>
        <h1 className="text-2xl font-bold mb-3">Setup</h1>
        <button className = "btn-btn-primary mb-3" onClick = {() => myNav("/play")}>Start playing</button>
      </div>
    );
};