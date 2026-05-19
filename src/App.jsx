import { useEffect, useState } from "react";
import "./App.css";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? "http://localhost:8080" : "");
const employeeUrl = `${API_BASE_URL}/employee`;

function App() {
  const [user, setUser] = useState([]);
  const [firstName, setName] = useState("");
  const [lastName, setLastname] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await fetch(employeeUrl);
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Failed to load employees", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addName = async () => {
    if (!firstName.trim() || !lastName.trim()) return;

    try {
      await fetch(employeeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fname: firstName,
          lname: lastName,
        }),
      });

      await fetchUsers();
      setName("");
      setLastname("");
    } catch (error) {
      console.error("Failed to add employee", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await fetch(`${employeeUrl}/${id}`, {
        method: "DELETE",
      });
      setUser((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to delete employee", error);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center">
      <div className="flex flex-col pt-[50px] gap-5">
        <input
          type="text"
          className="text-[20px] pl-2 rounded-md"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          className="text-[20px] pl-2 rounded-md"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastname(e.target.value)}
        />
        <button
          className="bg-green-600 pl-3 pe-3 pt-1 pb-1 rounded-md text-white"
          onClick={addName}
        >
          submit
        </button>
      </div>
      {user.length > 0 && (
        <ul
          id="list"
          className="w-[700px] h-[400px] overflow-y-scroll no-scrollBar"
        >
          {user.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center pe-5 pl-10 pt-5 pb-5 border-[1px] rounded-lg mt-5"
            >
              <p className="text-white">{item.fname}</p>
              <p className="text-white">{item.lname}</p>
              <button
                className="pl-3 pe-3 pt-1 pb-1 rounded-md text-white bg-red-500"
                onClick={() => deleteUser(item.id)}
              >
                delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
