import "./App.css";
import jumboImage from "./jumboimage.jpg";
import { useEffect, useState } from "react";

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function App() {
  const [registrationDetails, setRegistrationDetails] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [registrationMessage, setRegistrationMessage] = useState("");
  const [top100, setTop100] = useState([]);

  useEffect(() => {
    try {
      const fetchTop100 = async () => {
        const res = await fetch("http://localhost:8250/ranking", {
          method: "GET",
        });

        const ttt = await res.json();
        console.log("res data: ", ttt);

        if (ttt?.data) {
          setTop100(ttt?.data);
        }
      };

      fetchTop100();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const registerHandler = async () => {
    if (validateEmail(registrationDetails?.email) === null) {
      alert("Wrong email format!");
      return;
    }

    if (
      registrationDetails?.username === "" ||
      registrationDetails?.username === undefined
    ) {
      alert("username cant be empty");
      return;
    }
    if (
      registrationDetails?.email === "" ||
      registrationDetails?.email === undefined
    ) {
      alert("email cant be empty");
      return;
    }

    if (
      registrationDetails?.password === "" ||
      registrationDetails?.password === undefined
    ) {
      alert("password cant be empty");
      return;
    }

    const { username, email, password } = registrationDetails;

    try {
      const res = await fetch("http://localhost:8250/register", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (res?.status === 403) {
        setRegistrationMessage(`Username or Email already exist!
        Please refresh the page and try again!`);
        return;
      }

      if (res?.status === 200) {
        setRegistrationMessage(
          `Your is account is created! 
  Username: ${registrationDetails.username}
  Password: ${registrationDetails.password}`
        );

        return;
      }

      setRegistrationMessage(`Something went wrong!
      Please refresh the page and try again! ${res.status}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      <body className="bg-gray-900 text-white">
        {/* <!-- Jumbotron --> */}
        <section
          className="relative contain bg-cover bg-no-repeat bg-center h-[300px] sm:h-[800px] w-[100vw]"
          style={{
            backgroundImage: `url(${jumboImage})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10 flex flex-col justify-center items-center h-full">
            <h1 className="text-lg sm:text-xl xl:text-4xl font-bold text-yellow-500">
              Mu Online Moonwell - Season 6 Server!
            </h1>
            <p className="text-lg mt-4">
              Register now and start your adventure.
            </p>
            <a
              href="#register"
              className="hover:cursor-pointer mt-8 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full text-xl"
            >
              Register Now
            </a>
          </div>
        </section>

        <section id="register" className="py-16 bg-gray-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start justify-center">
              {registrationMessage && (
                <pre className="whitespace-break-spaces text-orange-300 text-md font-semibold">
                  {registrationMessage}
                </pre>
              )}
              {/* <!-- Register Section --> */}
              {registrationMessage === "" && (
                <div className="bg-gray-700 p-8 rounded-lg shadow-lg">
                  <h2 className="text-3xl font-bold text-yellow-500 text-center mb-8">
                    Register
                  </h2>
                  <div className="space-y-6" autocomplete="off">
                    <div>
                      <label
                        for="email"
                        className="block mb-2 text-sm text-white"
                      >
                        Email
                      </label>

                      <input className="hidden" type="text" name="email" />

                      <input
                        type="email"
                        id="email"
                        className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white"
                        required
                        value={registrationDetails.email}
                        onChange={(e) =>
                          setRegistrationDetails({
                            ...registrationDetails,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label
                        for="username"
                        className="block mb-2 text-sm text-white"
                      >
                        Username
                      </label>

                      <input className="hidden" type="text" name="username" />

                      <input
                        autoComplete="new-password"
                        type="text"
                        className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white"
                        required
                        value={registrationDetails.username}
                        onChange={(e) =>
                          setRegistrationDetails({
                            ...registrationDetails,
                            username: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label
                        for="password"
                        className="block mb-2 text-sm text-white"
                      >
                        Password
                      </label>
                      <input
                        autoComplete="new-password"
                        type="password"
                        id="password"
                        className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white"
                        required
                        value={registrationDetails.password}
                        onChange={(e) =>
                          setRegistrationDetails({
                            ...registrationDetails,
                            password: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label
                        for="captcha"
                        className="block mb-2 text-sm text-white"
                      >
                        Captcha (Coming Soon)
                      </label>
                      <input
                        type="text"
                        id="captcha"
                        className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-gray-400"
                        disabled
                        placeholder="Captcha here"
                      />
                    </div>
                    <button
                      onClick={() => registerHandler()}
                      type="submit"
                      className="w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg font-semibold"
                    >
                      Register
                    </button>
                  </div>
                </div>
              )}

              {/* <!-- Reset Character Section --> */}
              <div className="bg-gray-700 p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-yellow-500 text-center mb-8">
                  Reset Character
                </h2>
                <form className="space-y-6">
                  <div>
                    <label
                      className="block mb-2 text-sm text-white"
                      for="username"
                    >
                      Username
                    </label>
                    <input
                      className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white"
                      type="text"
                      id="username"
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="block mb-2 text-sm text-white"
                      for="password"
                    >
                      Password
                    </label>
                    <input
                      className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white"
                      type="password"
                      id="password"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="block mb-2 text-sm text-white"
                      for="captcha"
                    >
                      Captcha
                    </label>
                    <input
                      className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white"
                      type="text"
                      id="captcha"
                      placeholder="Enter captcha"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-semibold"
                  >
                    Reset Character
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* <!-- Download Section --> */}
        <section id="download" className="py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-yellow-500 mb-8">
              Download the Game
            </h2>
            <a
              href="#"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-xl rounded-full"
            >
              Download Mu Online Client
            </a>
            <p className="mt-4 text-gray-400">
              Please ensure you have the latest version of the game.
            </p>
          </div>
        </section>

        {/* <!-- Top 100 Players Section --> */}
        <section id="players" className="py-16">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-yellow-500 mb-8">
              Top 100 Players
            </h2>
            <div className="bg-gray-800 w-full rounded-lg p-6 shadow-lg flex flex-col items-center text-white">
              <div className="flex flex-col items-center">
                {top100 &&
                  top100.map((player) => {
                    return (
                      <p className="text-left">
                        Name: {player.Name}| Level: {player.cLevel} | Resets:
                        {player.RESETS} |
                      </p>
                    );
                  })}
              </div>
            </div>
          </div>
        </section>

        {/* <!-- News Section --> */}
        <section className="py-16 bg-gray-800">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-yellow-500 text-center mb-8">
              Server News & Info
            </h2>
            <div className="space-y-6">
              <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold">
                  Latest Update: Season 6 Released!
                </h3>
                <p className="mt-2">
                  We are excited to announce the release of Season 6! Classic
                  maps, events, and equipment are now available.
                </p>
              </div>
              <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold">Server Info</h3>
                <p className="mt-2">
                  Experience Rate: Medium | Drop Rate: 70% | Max Level: 400 |
                  Max Resets: 100 | Season 6
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* <!-- Contact Us Section --> */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-yellow-500 mb-8">
              Contact Us
            </h2>
            <p className="text-gray-400">
              For any inquiries, please contact us at:
              <a
                href="mailto:admin@admin.com"
                className="text-blue-500 hover:underline"
              >
                admin@admin.com
              </a>
            </p>
          </div>
        </section>

        <footer className="py-6 bg-gray-900 text-center text-gray-400">
          <p>&copy; 2024 Mu Online Private Server. All Rights Reserved.</p>
        </footer>
      </body>
    </div>
  );
}

export default App;
