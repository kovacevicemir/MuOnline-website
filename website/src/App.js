import "./App.css";
import jumboImage from "./jumboimage.webp";
import { useEffect, useState } from "react";
import SimpleCaptcha from "./Captcha";
import EmbeddedVideo from "./EmbeddedVideo";
import Countdown from "react-countdown";
import labyrinthmulogo from "./labyrinthmulogo.webp"

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
  const targetDate = new Date("2024-10-27T19:00:00+08:00");

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

  const countdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <span>Time's up!</span>; // What to show when the countdown is over
    } else {
      return (
        <div className="flex space-x-2 text-white font-black text-3xl font-[UnifrakturMaguntia] m-4">
          {/* Days */}
          <div className="flex flex-col items-center">
            <div
              className="bg-gray-800 whitesmoke p-2 w-12 h-12 flex items-center justify-center rounded-md shadow-lg"
              style={{ border: "4px solid #9999ff" }}
            >
              {days}
            </div>
            <span className="text-sm whitesmoke mt-1">days</span>
          </div>

          {/* Hours */}
          <div className="flex flex-col items-center">
            <div
              className="bg-gray-800 whitesmoke p-2 w-12 h-12 flex items-center justify-center rounded-md shadow-lg"
              style={{ border: "4px solid #9999ff" }}
            >
              {hours}
            </div>
            <span className="text-sm whitesmoke mt-1">hrs</span>
          </div>

          {/* Minutes */}
          <div className="flex flex-col items-center">
            <div
              className="bg-gray-800 whitesmoke p-2 w-12 h-12 flex items-center justify-center rounded-md shadow-lg"
              style={{ border: "4px solid #9999ff" }}
            >
              {minutes}
            </div>
            <span className="text-sm whitesmoke mt-1">min</span>
          </div>

          {/* Seconds */}
          <div className="flex flex-col items-center">
            <div
              className="bg-gray-800 whitesmoke p-2 w-12 h-12 flex items-center justify-center rounded-md shadow-lg"
              style={{ border: "4px solid #9999ff" }}
            >
              {seconds}
            </div>
            <span className="text-sm whitesmoke mt-1">sec</span>
          </div>
        </div>
      );
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
          className="relative contain bg-cover bg-no-repeat bg-center h-[100vh] sm:h-[800px] w-[100vw]"
          style={{
            backgroundImage: `url(${jumboImage})`,
            backgroundSize: "",
            backgroundPosition: "center",
            maxWidth: "1920px",
            boxShadow:"-1px 19px 20px 1px black"
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10 flex flex-col justify-center items-center h-full">
            <img src={labyrinthmulogo} width={420} />
            <h1
              className="text-lg sm:text-3xl xl:text-4xl font-extrabold text-yellow-400 mt-4 tracking-wide uppercase"
              style={{
                textShadow:
                  "2px 2px 4px #000000, 4px 4px 6px rgba(0, 0, 0, 0.8)", // Stronger shadow for a game-like effect
                fontFamily: "monospace",
                letterSpacing: "0.15em", // A bit of space between letters for impact
              }}
            >
              Labyrinth Mu - Season 6!
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
                color: "white",
                fontFamily: "",
                textShadow: "1px 1px black",
                backgroundColor: "#9999ff",
              }}
              className="mt-12 rounded-md px-3 sm:text-md mx-2"
            >
              Grand opening - 27. October 7pm (GMT+8) 2024
            </strong>
            <Countdown date={targetDate} renderer={countdownRenderer} />
          </div>
        </section>

        <EmbeddedVideo />

        <section id="register" className="py-16 bg-gray-800" style={{boxShadow: 'inset 1px 12px 20px black'}}>
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
                      disabled
                      type="submit"
                      className="w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg font-semibold"
                    >
                      Register
                    </button>
                    {/* <span style={{fontStyle:'italic', fontSize:"12px"}}>Registration will be available soon!</span> */}
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
                  <div className="shadow-md rounded-md py-5">
                    <h2 className="text-3xl font-bold text-yellow-500 mb-8">
                      Download the Game
                    </h2>
                    <a
                      href="https://mega.nz/file/jqY1RDCY#GWu8W33UytWyUxOsoWm6ol4SXKgEvF85YrD5w9TPG1k"
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
                    <ul className="mt-2 text-left text-sm">
                      <li>1. Download Mu online Client</li>
                      <li>2. Extract files</li>
                      <li className="text-orange">
                        3. Install all from
                        Visual-C-Runtimes-All-in-One folder<br/>
                        "install_all.bat" - double click!
                      </li>
                      <li>
                        4. Set resolution:
                        <ul>
                         <li>-Use MuResolution.exe from MuScreenResolution folder</li>
                         <li>-Or use Scripts from MuScreenResolution folder</li>
                        </ul>
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
            <h2 className="text-3xl font-bold text-[#9999ff] mb-4">
              Top 20 Players
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
              href="https://www.facebook.com/groups/395882375216868"
              target="_blank"
              className="text-blue-500 hover:underline"
            >
              LabyrinthMu 2024 - Facebook
            </a>
          </div>
        </section>

        {/* <!-- News Section --> */}
        <section className="py-16 bg-gray-800">
          <div className="max-w-5xl mx-auto px-2">
            <div className="flex flex-col">
              <div className="space-y sm:flex gap-4 justify-center">
                <div className="bg-gray-700 w-fit p-6 rounded-lg shadow-lg mt-1">
                  <h3 className="text-2xl font-semibold mb-4">Server Info</h3>
                  <ul class=" pl-6 space-y-2 text-white text-left list-none">
                    <li>
                      ✅ <strong>Version:</strong> Season 6 Episode 3
                    </li>
                    <li>
                      ✅ <strong>Server Files:</strong> IGC Premium
                    </li>
                    <li>
                      ✅ <strong>Hosting:</strong> Premium dedicated VPS
                    </li>
                    <li>
                      ✅ <strong>Normal Exp:</strong> 200x
                    </li>
                    <li>
                      ✅ <strong>Master Exp:</strong> 100x
                    </li>
                    <li>
                      ✅ <strong>Drop:</strong> 60%
                    </li>
                    <li>
                      ✅ <strong>Top UP Wcoins Ratio:</strong>
                    </li>
                    <hr class="border-t-2 border-gray-700" />
                    <li>
                      ✅ <strong>Max Level:</strong> 400
                    </li>
                    <li>
                      ✅ <strong>Max Master Level:</strong> 200
                    </li>
                    <li>
                      ✅ <strong>Max Item Level:</strong> +13 (+15 disabled,
                      coming soon)
                    </li>
                    <li>
                      ✅ <strong>Max Excellent Options:</strong> 2
                    </li>
                    <li>
                      ✅ <strong>Max Socket:</strong> (Disabled, coming soon)
                    </li>
                    <li>
                      ✅ <strong>Normal 380 weapon and Set:</strong> (BOSS DROP
                      ONLY)
                    </li>
                    <li>
                      ✅ <strong>Normal Ancient Items</strong>
                    </li>
                    <li>
                      ✅ <strong>Excellent Accessories:</strong> 3% opt (HP rec)
                      | 2opt excellent
                    </li>
                    <li>
                      ✅ <strong>2 opt excellent items:</strong> lootable in Box
                      of Kundun via Golden Invasion
                    </li>
                    <li>
                      ✅ <strong>Excellent Accessories:</strong> huntable at
                      Boss Mobs
                    </li>
                    <hr class="border-t-2 border-gray-700" />
                    <li>
                      ✅ <strong>Chaos Machine:</strong> Customize
                    </li>
                    <li>
                      ✅ <strong>Free RF & Summoner</strong> 
                    </li>
                    <li>
                      ✅ <strong>Online Reward per hour:</strong> 5
                    </li>
                    <li>
                      ✅ <strong>Client Limit:</strong> 5 per pc/hwid
                    </li>
                    <li>
                      ✅ <strong>Non Reset</strong>
                    </li>
                    <li>
                      ✅ <strong>Normal Socket Items Max:</strong> 3 slot (once
                      updated/release)
                    </li>
                    <li>
                      ✅ <strong>Normal 380 set</strong>
                    </li>
                    <li>
                      ✅ <strong>Normal Ancient</strong>
                    </li>
                    <li>
                      💯 <strong>No Item Donation</strong>
                    </li>
                    <li>
                      💯 <strong>Non Bias Admin/GM</strong>
                    </li>
                    <li>
                      💯 <strong>Well Managed Server</strong>
                    </li>
                    <li>
                      💯 <strong>Active Admin/GM</strong>
                    </li>
                    <li>
                      💯 <strong>Weekend Exp Boost</strong>
                    </li>
                    <li>
                      💯 <strong>Cash Prizes Events/CS</strong>
                    </li>
                    <li>
                      ✅ <strong>Open php|RMT</strong>
                    </li>
                  </ul>
                </div>
                {/* <div className="bg-gray-700 w-fit p-6 rounded-lg shadow-lg mt-1">
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
                </div> */}
              </div>
              <div className="bg-gray-700 p-6 rounded-lg shadow-lg sm:flex flex-col justify-center mt-5 sm:mt-2 ">
                <h3 className="text-2xl font-semibold">
                  Latest Update: Season 6 Grand Opening!
                </h3>
                <p className="mt-2 mb-4">
                  We are excited to announce the release of Season 6! Classic
                  maps, events, and equipment are now available.
                </p>
                <strong style={{ color: "yellowgreen" }}>
                  LAUNCH DATE: 27. October (6pm GMT+8) 2024
                </strong>
              </div>
            </div>
          </div>
        </section>

        {/* <!-- Contact Us Section --> */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#9999ff] mb-8">
              Contact Us
            </h2>
            <p className="text-gray-400">
              For any inquiries, please contact us at:{" "}
              <a
                href="https://www.facebook.com/groups/395882375216868"
                target="_blank"
                className="text-blue-500 hover:underline"
              >
                Labyrinth Mu 2024 - Facebook
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
