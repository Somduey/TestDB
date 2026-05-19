import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_URL;
const EMPLOYEE_URL = API_BASE ? `${API_BASE}/employee` : "/employee";

function App() {
  const [user, setUser] = useState([]);
  const [firstName, setName] = useState("");
  const [lastName, setLastname] = useState("");
  const [check, setCheck] = useState(false);

  useEffect(() => {
    fetch(EMPLOYEE_URL)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => {
        console.error("Failed to load employees", err);
      });
  }, []);

  function addName() {
    fetch(EMPLOYEE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: null,
        fname: firstName,
        lname: lastName,
      }),
    })
      .then(() => {
        return fetch(EMPLOYEE_URL);
      })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      })
      .catch((err) => {
        console.error("Failed to add name", err);
      });
    setName("");
    setLastname("");
  }

  function deleteUser(id) {
    fetch(`${EMPLOYEE_URL}/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setUser(user.filter((i) => i.id !== id));
      })
      .catch((err) => {
        console.error("Failed to delete user", err);
      });
  }

  useEffect(() => {
    if (user.length == 0) {
      setCheck(false);
    } else if (user.length > 0) {
      setCheck(true);
    }
  }, [user]);

  return (
    <div className="w-screen h-screen flex flex-col items-center">
      <div className="flex flex-col pt-[50px] gap-5">
        <input
          type="text"
          id="input"
          className="text-[20px] pl-2 rounded-md"
          value={firstName}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <input
          type="text"
          id="input"
          className="text-[20px] pl-2 rounded-md"
          value={lastName}
          onChange={(e) => {
            setLastname(e.target.value);
          }}
        />
        <button
          className="bg-green-600 pl-3 pe-3 pt-1 pb-1 rounded-md text-white"
          onClick={addName}
        >
          submit
        </button>
      </div>
      {/* list */}
      {check && (
        <ul id="list" className="w-[700px] h-[400px] overflow-y-scroll no-scrollBar">
          {user.map((item, index) => {
            return (
              <li
                key={index}
                className="flex justify-between items-center pe-5 pl-10 pt-5 pb-5 border-[1px] rounded-lg mt-5"
              >
                <p className="text-white">{item.fname}</p>
                <p className="text-white">{item.lname}</p>
                <button
                  className="pl-3 pe-3 pt-1 pb-1 rounded-md text-white bg-red-500"
                  onClick={() => {
                    deleteUser(item.id);
                  }}
                >
                  delete
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default App;
