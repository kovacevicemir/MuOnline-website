import "./App.css";
import jumboImage from "./jumboimage.jpg";
import { useEffect, useState } from "react";
import SimpleCaptcha from "./Captcha";
import EmbeddedVideo from "./EmbeddedVideo";

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

  // const [resetDetails, setResetDetails] = useState({
  //   username: "",
  //   nickname: "",
  //   password: "",
  // });
  // const [resetMessage, setResetMessage] = useState("");
  const [top100, setTop100] = useState([]);

  const [isCaptchaOk, setIsCaptchaOk] = useState(false);

  const isMedal = (index) => {
    if (index === 1) {
      return <>🥇</>;
    }
    if (index === 2) {
      return <>&#129352;</>;
    }
    if (index === 3) {
      return <>&#129353;</>;
    }
  };

  const backendURL =
    process.env.REACT_APP_IS_PROD === "YES"
      ? process.env.REACT_APP_PROD_BACKEND_URL
      : "http://localhost:8250";

  useEffect(() => {
    try {
      const fetchTop100 = async () => {
        const res = await fetch(`${backendURL}/ranking`, {
          method: "GET",
        });

        const ttt = await res.json();
        if (ttt?.data) {
          setTop100(ttt?.data);
        }
      };

      fetchTop100();
    } catch (error) {
      console.log(error);
    }
  }, []);

  // const handleReset = async () => {
  //   if (resetDetails?.username === "" || resetDetails?.username === undefined) {
  //     alert("username cant be empty");
  //     return;
  //   }

  //   if (resetDetails?.password === "" || resetDetails?.password === undefined) {
  //     alert("password cant be empty");
  //     return;
  //   }

  //   if (resetDetails?.nickname === "" || resetDetails?.nickname === undefined) {
  //     alert("nickname cant be empty");
  //     return;
  //   }

  //   const { username, password, nickname } = resetDetails;

  //   try {
  //     const res = await fetch(`${backendURL}/reset`, {
  //       method: "post",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ username, nickname, password }),
  //     });

  //     if (res?.status === 403) {
  //       setResetMessage(`Username or password is wrong!`);
  //       return;
  //     }

  //     if (res?.status === 401) {
  //       setResetMessage(`Character has to be level 400!`);
  //       return;
  //     }

  //     if (res?.status === 200) {
  //       setResetMessage(
  //         `+1 Reset successfully
  // Username: ${resetDetails.username}`
  //       );

  //       return;
  //     }

  //     setResetMessage(`Something went wrong!
  //     Please refresh the page and try again! ${res.status}`);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const normalizeClassName = (classNo) => {
    switch (classNo) {
      case 0:
        return "Dark Wizard";
      case 1:
        return "Soul Master";
      case 2:
        return "Soul Master";
      case 16:
        return "Dark Knight";
      case 17:
        return "Blade Knight";
      case 18:
        return "Blade Master";
      case 48:
        return "Magic Gladiator";
      case 64:
        return "Dark Lord";
      case 66:
        return "Lord Emperor";
      case 32:
        return "Elf";
      case 33:
        return "Muse Elf";
      case 96:
        return "Rage fighter";
      case 80:
        return "Summoner";
      case 81:
        return "Bloody Summoner";
      case 98:
        return "Grand Master";

      default:
        return classNo;
    }
  };

  const registerHandler = async () => {
    if (isCaptchaOk === false) {
      alert("Enter correct captcha!");
      return;
    }

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
      const res = await fetch(`${backendURL}/register`, {
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
          `Your account is created! 
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
    <div className="App flex justify-center bg-gray-700">
      <body
        className="bg-gray-900 text-white"
        style={{ maxWidth: "1920px", overflow: "hidden" }}
      >
        {/* <!-- Jumbotron --> */}
        <section
          className="relative contain bg-cover bg-no-repeat bg-center h-[300px] sm:h-[800px] w-[100vw]"
          style={{
            backgroundImage: `url(${jumboImage})`,
            backgroundSize: "",
            backgroundPosition: "center",
            maxWidth: "1920px",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10 flex flex-col justify-center items-center h-full">
            <h1
              className="text-lg sm:text-3xl xl:text-4xl font-bold text-yellow-500"
              style={{ textShadow: "1px 1px black" }}
            >
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
            <strong
              style={{
                color: "yellowgreen",
                fontFamily: "monospace",
                textShadow: "1px 1px black",
                backgroundColor: "white",
              }}
              className="mt-12 rounded-md px-3 sm:text-md"
            >
              Official opening - 18. October (7pm GMT+8) 2024
            </strong>
          </div>
        </section>

        <EmbeddedVideo />

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
                        maxLength={35}
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
                        maxLength={16}
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
                        maxLength={16}
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
                      <SimpleCaptcha setIsCaptchaOk={setIsCaptchaOk} />
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

              {/* <!-- Reset Character Section -->
              {resetMessage && (
                <pre className="whitespace-break-spaces text-orange-300 text-md font-semibold">
                  {resetMessage}
                </pre>
              )}
              {resetMessage === "" && (
                <div className="bg-gray-700 p-8 rounded-lg shadow-lg">
                  <h2 className="text-3xl font-bold text-yellow-500 text-center mb-8">
                    Reset Character
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label
                        className="block mb-2 text-sm text-white"
                        for="username"
                      >
                        Username
                      </label>
                      <input
                        autoComplete="new-password"
                        className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white"
                        type="text"
                        id="username"
                        placeholder="Enter your username"
                        required
                        onChange={(e) =>
                          setResetDetails({
                            ...resetDetails,
                            username: e.target.value,
                          })
                        }
                        value={resetDetails.username}
                      />
                    </div>
                    <div>
                      <label
                        className="block mb-2 text-sm text-white"
                        for="nickname"
                      >
                        Nickname
                      </label>
                      <input
                        autoComplete="new-password"
                        className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white"
                        type="text"
                        id="nickname"
                        placeholder="Enter your char nickname"
                        required
                        onChange={(e) =>
                          setResetDetails({
                            ...resetDetails,
                            nickname: e.target.value,
                          })
                        }
                        value={resetDetails.nickname}
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
                        autoComplete="new-password"
                        className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white"
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        required
                        onChange={(e) =>
                          setResetDetails({
                            ...resetDetails,
                            password: e.target.value,
                          })
                        }
                        value={resetDetails.password}
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
                      onClick={() => handleReset()}
                    >
                      Reset Character
                    </button>
                  </div>
                </div>
              )} */}
              {/* <!-- Download Section --> */}
              <section id="download" className="pb-16">
                <div className="max-w-3xl mx-auto text-center">
                  <div className="shadow-md rounded-md py-6">
                    <h2 className="text-3xl font-bold text-yellow-500 mb-8">
                      Download the Game
                    </h2>
                    <a
                      href="https://mega.nz/file/WrASSLqQ#jHY3R0Rl87lRrJ5WNVUzwzO7idbRWwKPUGAffMYhjj8"
                      target="_blank"
                      className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-xl rounded-full"
                    >
                      Download Mu Online Client
                    </a>
                    <p className="my-10 text-gray-400">
                      Please ensure you have the latest version of the game.
                    </p>
                  </div>
                  <div className="p-6 mt-10 rounded-lg shadow-md flex flex-col items-center">
                    <h3 className="text-2xl font-semibold mb-4">
                      Installation
                    </h3>
                    <ul className="mt-2 text-left ">
                      <li>1. Download Mu online Client</li>
                      <li>2. Extract files</li>
                      <li>
                        3. Install all from
                        Visual-C-Runtimes-All-in-One-May-2024 folder
                        "install_all.bat" - double click!
                      </li>
                      <li>
                        4. Set resolution - download & use{" "}
                        <a
                          className="text-blue-600"
                          href="https://mega.nz/file/7u5jVILD#ENl7e0IphK3bUIp4ENcTSXW0N3rtfv4sEJKiZ6CROfg"
                        >
                          Mu screen resolution settings program
                        </a>
                      </li>
                      <li>5. Click on main.exe Start the game!</li>
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>

        {/* <!-- Top 100 Players Section --> */}
        <section id="players" className="py-16">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-yellow-500 mb-8">
              Top 10 Players
            </h2>
            <div className="w-full justify-center rounded-lg p-6 shadow-lg flex flex-col items-center text-white">
              <div
                style={{ maxWidth: "600px" }}
                className="flex w-full flex-col items-center border rounded-lg border-blue-500"
              >
                {top100 && (
                  <table className="table-auto w-full border-collapse border border-blue-500 rounded-lg overflow-hidden">
                    <thead className="bg-gray-800 text-blue-300">
                      <tr>
                        <th className="px-4 py-2 text-center">Name</th>
                        <th className="border border-blue-500 px-4 py-2 text-center">
                          Level
                        </th>
                        {/* <th className="border border-blue-500 px-4 py-2 text-center">
                          Resets
                        </th> */}
                        <th className="border border-blue-500 px-4 py-2 text-center">
                          Class
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {top100 &&
                        top100.slice(0, 10).map((player, index) => (
                          <tr
                            key={index}
                            className={`${
                              index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                            } hover:bg-gray-600 transition-all border border-blue-500`}
                          >
                            <td className=" px-4 py-2 flex mt-2 sm:mt:0">
                              <div
                                style={{ width: "10px", marginRight: "15px" }}
                              >{`[${index + 1}]`}</div>{" "}
                              <span className="ml-2">
                                {player.Name} {isMedal(index + 1)}
                              </span>
                            </td>
                            <td className="border border-blue-500 px-4 py-2 text-center">
                              {player.cLevel}
                            </td>
                            {/* <td className="border border-blue-500 px-4 py-2 text-center">
                              {player.RESETS}
                            </td> */}
                            <td className="border border-blue-500 px-4 py-2 text-center">
                              {normalizeClassName(player.Class)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
            <a
              href="https://www.facebook.com/groups/1022381109629604"
              target="_blank"
              className="text-blue-500 hover:underline"
            >
              MU Moonwell 2024 - Facebook
            </a>
          </div>
        </section>

        {/* <!-- News Section --> */}
        <section className="py-16 bg-gray-800">
          <div className="max-w-5xl mx-auto px-2">
            <h2 className="text-3xl font-bold text-yellow-500 text-center mb-8">
              Server News & Info
            </h2>
            <div className="flex flex-col">
              <div className="space-y sm:flex gap-4 justify-center">
                <div className="bg-gray-700 w-fit p-6 rounded-lg shadow-lg mt-1">
                  <h3 className="text-2xl font-semibold">Server Info</h3>
                  <ul className="mt-2 flex items-center flex-col">
                    <div className="text-left ml-10 min-w-[165px]">
                      <li>Experience Rate: 10x &#10003;</li>
                      <li>Experience Rate Master: 10x &#10003;</li>
                      <li> Max Level: 400 &#10003;</li>
                      <li>Season 6 &#10003;</li>
                      <li>Drop rate 50% - medium &#10003;</li>
                      <li>No OP items in shops &#10003;</li>
                      <li>RMT available &#10003;</li>
                      <li>Offline leveling &#10003;</li>
                      <li>Set Party & Party exp bonus &#10003;</li>
                      <li>Max clients 3 &#10003;</li>
                      <li>Max Item option 2 &#10003;</li>
                    </div>
                  </ul>
                </div>
                <div className="bg-gray-700 w-fit p-6 rounded-lg shadow-lg mt-1">
                  <h3 className="text-2xl font-semibold">Donations</h3>
                  <ul className="mt-2 flex items-center flex-col">
                    <div className="text-left ml-10 min-w-[165px]">
                      100 php = 200 wcoins <br />
                      200 php = 480 wcoins
                      <br />
                      500 php = 1200 wcoins
                      <br />
                      1000 php = 2400 wcoins
                      <br />
                      1500 php = 3600 wcoins
                      <br />
                      2000 php = 4800 wcoins
                      <br />
                    </div>
                  </ul>
                </div>
              </div>
              <div className="bg-gray-700 p-6 rounded-lg shadow-lg sm:flex flex-col justify-center mt-5 sm:mt-2 ">
                <h3 className="text-2xl font-semibold">
                  Latest Update: Season 6 Released!
                </h3>
                <p className="mt-2 mb-4">
                  We are excited to announce the release of Season 6! Classic
                  maps, events, and equipment are now available.
                </p>
                <strong style={{ color: "yellowgreen" }}>
                  LAUNCH DATE: 18. October (7pm GMT+8) 2024
                </strong>
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
              For any inquiries, please contact us at:{" "}
              <a
                href="https://www.facebook.com/groups/1022381109629604"
                target="_blank"
                className="text-blue-500 hover:underline"
              >
                MU Moonwell 2024 - Facebook
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
